/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { inject, Injectable, Provider } from '@angular/core';
import { BehaviorSubject, from, merge, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import {
  HttpBackend,
  HttpDownloadProgressEvent,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpFeatureKind,
  HttpHeaderResponse,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';

const XSSI_PREFIX = /^\)\]\}',?\n/;

const REQUEST_URL_HEADER = `X-Request-URL`;

/**
 * Determine an appropriate URL for the response, by checking either
 * response url or the X-Request-URL header.
 */
function getResponseUrl(response: Response): string | null {
  if (response.url) {
    return response.url;
  }
  // stored as lowercase in the map
  const xRequestUrl = REQUEST_URL_HEADER.toLocaleLowerCase();
  return response.headers.get(xRequestUrl);
}

/**
 * Uses `fetch` to send requests to a backend server.
 *
 * This `FetchBackend` requires the support of the
 * [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) which is available on all
 * supported browsers and on Node.js v18 or later.
 *
 * @see {@link HttpHandler}
 *
 * @publicApi
 * @developerPreview
 */
@Injectable()
export class FetchBackend implements HttpBackend {
  // We need to bind the native fetch to its context or it will throw an "illegal invocation"
  private readonly fetchImpl =
    inject(FetchFactory, { optional: true })?.fetch ?? fetch.bind(globalThis);

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const abortController = new AbortController();

    // Workaround: We need to schedule a macrotask to keep the NgZone unstable during the request
    // This is due to the ZoneJS only patching patching the initial fetch promise (the header one)
    // but not the body
    const macroTaskCanceller = createBackgroundMacroTask();

    // TODO: use `AsyncGenerators` instead of `BehaviorSubject` when we no longer support RXJS 6.x
    // We can't use it now because from() doesn't accept generators on RxJS 6.
    // Just replace `reportEvent` calls with `yield`.
    const eventStream = new BehaviorSubject<HttpEvent<any>>({
      type: HttpEventType.Sent,
    });
    return merge(
      // we cannot pass eventStream.next directly because it throws when unbound with
      // RxJS 7.
      from(
        this.doRequest(req, abortController.signal, (event) =>
          eventStream.next(event)
        ).finally(() => {
          eventStream.complete();
        })
      ),
      eventStream
    ).pipe(
      finalize(() => {
        // Aborting the fetch call when the observable is unsubscribed
        abortController.abort();

        // Request is cancelled, NgZone can go back to stable again.
        macroTaskCanceller();
      })
    );
  }

  private async doRequest(
    request: HttpRequest<any>,
    signal: AbortSignal,
    reportEvent: (event: HttpEvent<any>) => void
  ): Promise<HttpResponse<any>> {
    const init = this.createRequestInit(request);
    let response;

    try {
      response = await this.fetchImpl(request.url, { signal, ...init });
    } catch (error: any) {
      throw new HttpErrorResponse({
        error,
        status: error.status ?? 0,
        statusText: error.statusText,
        url: request.url,
        headers: error.headers,
      });
    }

    const headers = new HttpHeaders(toHeadersObj(response.headers));

    const statusText = response.statusText;
    const url = getResponseUrl(response) ?? request.url;

    let status = response.status;
    let body: string | ArrayBuffer | Blob | object | null = null;

    if (request.reportProgress) {
      reportEvent(new HttpHeaderResponse({ headers, status, statusText, url }));
    }

    if (response.body) {
      // Read Progess
      const contentLength = response.headers.get('content-length');
      const chunks: Uint8Array[] = [];
      const reader = response.body.getReader();
      let receivedLength = 0;

      let decoder: TextDecoder;
      let partialText: string | undefined;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        if (request.reportProgress) {
          partialText =
            request.responseType === 'text'
              ? (partialText ?? '') +
                (decoder ??= new TextDecoder()).decode(value, { stream: true })
              : undefined;

          reportEvent({
            type: HttpEventType.DownloadProgress,
            total: contentLength ? +contentLength : undefined,
            loaded: receivedLength,
            partialText,
          } as HttpDownloadProgressEvent);
        }
      }

      // Combine all chunks.
      const chunksAll = this.concatChunks(chunks, receivedLength);

      body = this.parseBody(request, response, chunksAll);
    }

    // Same behavior as the XhrBackend
    if (status === 0) {
      status = body ? HttpStatusCode.Ok : 0;
    }

    // ok determines whether the response will be transmitted on the event or
    // error channel. Unsuccessful status codes (not 2xx) will always be errors,
    // but a successful status code can still result in an error if the user
    // asked for JSON data and the body cannot be parsed as such.
    const ok = status >= 200 && status < 300;

    if (ok) {
      return new HttpResponse({
        body,
        headers,
        status,
        statusText,
        url,
      });
    }

    throw new HttpErrorResponse({
      error: body,
      headers,
      status,
      statusText,
      url,
    });
  }

  private parseBody(
    request: HttpRequest<any>,
    response: Response,
    binContent: Uint8Array
  ): string | ArrayBuffer | Blob | object | null {
    try {
      switch (request.responseType) {
        case 'json':
          // stripping the XSSI when present
          const text = new TextDecoder()
            .decode(binContent)
            .replace(XSSI_PREFIX, '');
          return text === '' ? null : (JSON.parse(text) as object);
        case 'text':
          return new TextDecoder().decode(binContent);
        case 'blob':
          return new Blob([binContent]);
        case 'arraybuffer':
          return binContent.buffer;
        default:
          return null;
      }
    } catch (error) {
      // body loading or parsing failed
      throw new HttpErrorResponse({
        error,
        headers: new HttpHeaders(response.headers as any),
        status: response.status,
        statusText: response.statusText,
        url: getResponseUrl(response) ?? request.url,
      });
    }
  }

  private createRequestInit(req: HttpRequest<any>): RequestInit {
    // We could share some of this logic with the XhrBackend

    const headers: any = {};

    const credentials: RequestCredentials | undefined = req.withCredentials
      ? 'include'
      : undefined;

    // Setting all the requested headers.
    (req.headers as any).forEach(
      (name: any, values: any) => (headers[name] = values.join(','))
    );

    // Add an Accept header if one isn't present already.
    headers['Accept'] ??= 'application/json, text/plain, */*';

    // Auto-detect the Content-Type header if one isn't present already.
    if (!headers['Content-Type']) {
      const detectedType = req.detectContentTypeHeader();
      // Sometimes Content-Type detection fails.
      if (detectedType !== null) {
        headers['Content-Type'] = detectedType;
      }
    }

    return {
      body: req.body,
      method: req.method,
      headers,
      credentials,
    };
  }

  private concatChunks(chunks: Uint8Array[], totalLength: number): Uint8Array {
    const chunksAll = new Uint8Array(totalLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    return chunksAll;
  }
}

/**
 * Abstract class to provide a mocked implementation of `fetch()`
 */
export abstract class FetchFactory {
  abstract fetch: typeof fetch;
}

/**
 * Configures the current `HttpClient` instance to make requests using the fetch API.
 *
 * This `FetchBackend` requires the support of the Fetch API which is available on all evergreen
 * browsers and on NodeJS from v18 onward.
 *
 * Note: The Fetch API doesn't support progress report on uploads.
 *
 * @publicApi
 * @developerPreview
 */
export function withFetch(): HttpFeature<any> {
  if (typeof fetch !== 'function') {
    // TODO: remove this error when the Node 16 support is dropped.
    throw new Error('The FetchBackend requires the fetch API.');
  }

  return makeHttpFeature(6 as HttpFeatureKind, [
    FetchBackend,
    { provide: HttpBackend, useExisting: FetchBackend },
  ]);
}

/**
 * A feature for use when configuring `provideHttpClient`.
 *
 * @publicApi
 */
export interface HttpFeature<KindT extends HttpFeatureKind> {
  ɵkind: KindT;
  ɵproviders: Provider[];
}

function makeHttpFeature<KindT extends HttpFeatureKind>(
  kind: KindT,
  providers: Provider[]
): HttpFeature<KindT> {
  return {
    ɵkind: kind,
    ɵproviders: providers,
  };
}

const MAX_INT = 2147483647;
export function createBackgroundMacroTask(): VoidFunction {
  const timeout = setTimeout(() => void 0, MAX_INT);

  return () => clearTimeout(timeout);
}

// Headers helpers

function toHeadersObj(headers: Headers): Record<string, any> {
  const headersObj: Record<string, any> = {};
  headers.forEach((values: string, name: string) => {
    const headerValues = (Array.isArray(values) ? values : [values]).map(
      (value) => value.toString()
    );
    const key = name.toLowerCase();
    headersObj[key] = headerValues;
  });
  return headersObj;
}
