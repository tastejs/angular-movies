import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
// import { makeStateKey, TransferState } from '@angular/platform-browser';
import { IconProviderToken } from '../token/icon-provider.token';
import { IconProvider } from '../token/icon-provider.model';

@Injectable()
export class TransferStateInterceptorSSR implements HttpInterceptor {
  constructor(
    //  private transferState: TransferState,
    @Inject(IconProviderToken)
    public iconProvider: IconProvider
  ) {}

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

    /**
     * No cached response exists. Go to the network, and cache
     * the response when it arrives.
     */
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const pattern = this.iconProvider.url('"').split('"').shift() + '';
          const matches = req.url.toString().includes(pattern);
          if (matches !== null) {
            console.log('TransferStateIntercepSSR', pattern, matches);
            // this.transferState.set(makeStateKey<any>(pattern), event.body);
          }
        }
      })
    );
  }
}
