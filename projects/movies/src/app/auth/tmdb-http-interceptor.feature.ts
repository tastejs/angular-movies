import {HttpHandlerFn, HttpInterceptorFn, HttpRequest,} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthState} from '../state/auth.state';
import {environment} from '../../environments/environment';

export const tmdbReadAccessInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = inject(AuthState).get().accessToken;

  return next(
    req.clone({
      setHeaders: {
        Authorization: token
          ? `Bearer ${token}`
          : `Bearer ${environment.tmdbApiReadAccessKey}`,
      },
    })
  );
};
