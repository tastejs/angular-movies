import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { AuthState } from '../state/auth.state';
import { environment } from '../../environments/environment';
import { first, map, switchMap } from 'rxjs';
import { AUTH_STATE_LOADED } from './auth-state-available.token';

export const tmdbReadAccessInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const isAuthStateLoaded$ = inject(AUTH_STATE_LOADED);
  const injector = inject(Injector);

  return isAuthStateLoaded$.pipe(
    first(),
    map(
      (isAuthStateLoaded) =>
        (isAuthStateLoaded && injector.get(AuthState).get().accessToken) ||
        environment.tmdbApiReadAccessKey
    ),
    switchMap((token) =>
      next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    )
  );
};
