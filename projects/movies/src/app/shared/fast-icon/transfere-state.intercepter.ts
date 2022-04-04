import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { TransferState } from '@angular/platform-browser';

@Injectable()
export class TransferStateInterceptor implements HttpInterceptor {
  constructor(private transferState: TransferState) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /**
     * Skip this interceptor if the request method isn't GET.
     */
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cachedResponse: any = this.transferState['store'][req.url];
    delete this.transferState['store'][req.url];

    if (cachedResponse) {
      console.log('TransferStateInterceptor', req.url);
      // A cached response exists which means server set it before. Serve it instead of forwarding
      // the request to the next handler.
      return of(new HttpResponse<any>({ body: cachedResponse }));
    }
    return next.handle(req);
  }
}
