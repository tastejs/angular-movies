import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

type ServerTimingRequest = {
  startTime(token: string, description: string): void;
  endTime(token: string): void;
};

let index = 0;

export function requestTimingInterceptor(
  requestName?: (_request: HttpRequest<any>) => string
) {
  return (
    request: HttpRequest<any>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<any>> => {
    const responseWithTiming = inject(RESPONSE, {
      optional: true,
    }) as unknown as HttpRequest<any> & ServerTimingRequest;
    const u = 'request' + index++;
    responseWithTiming?.startTime(
      u,
      requestName ? requestName(request) : request.urlWithParams
    );
    return next(request).pipe(finalize(() => responseWithTiming?.endTime(u)));
  };
}
