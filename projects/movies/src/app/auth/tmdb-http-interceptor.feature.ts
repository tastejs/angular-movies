import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AccessTokenFacade } from './access-token-facade.service';

export const tmdbReadAccessInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const accessTokenFacade = inject(AccessTokenFacade);

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessTokenFacade.accessToken}`,
      },
    }),
  );
};
