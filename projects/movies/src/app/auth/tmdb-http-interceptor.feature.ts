import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { first, of, switchMap } from 'rxjs';
import { AUTH_STATE_LOADED } from './auth-state-available.token';

export const tmdbReadAccessInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const isAuthStateLoaded$ = inject(AUTH_STATE_LOADED);
  const injector = inject(Injector);

  const getToken$ = isAuthStateLoaded$.pipe(
    first(),
    switchMap((isAuthStateLoaded) =>
      !isAuthStateLoaded
        ? of(environment.tmdbApiReadAccessKey)
        : import('../state/auth.state')
            .then((m) => injector.get(m.AuthState))
            .then(
              (authState) =>
                authState.get().accessToken || environment.tmdbApiReadAccessKey
            )
    )
  );

  return getToken$.pipe(
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
