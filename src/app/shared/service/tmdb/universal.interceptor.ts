import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable({
  providedIn: 'root',
})
export class UniversalInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Optional() @Inject(REQUEST) protected serverRequest?: Request
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (isPlatformServer(this.platformId)) {
      if (request.method === 'GET') {
        const requestUrl = request.url.replace(/^\./, '');
        if (
          this.serverRequest &&
          !(requestUrl.startsWith('http') || requestUrl.startsWith('//'))
        ) {
          const protocolHost = `${
            this.serverRequest.protocol
          }://${this.serverRequest.get('host')}`;
          const pathSeparator = !requestUrl.startsWith('/') ? '/' : '';
          const url = protocolHost + pathSeparator + requestUrl;
          request = request.clone({ url });
        }
      } else {
        return EMPTY; // return all call except GET method
      }
    }
    return next.handle(request);
  }
}
