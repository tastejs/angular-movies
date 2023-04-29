import {withInterceptors} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthState} from "../state/auth.state";
import {environment} from "../../environments/environment";

export function withTmdbReadAccessInterceptors() {
  return withInterceptors([(req, next) => {
    const authService = inject(AuthState)
    const token = authService.get().accessToken;

    return next(
      req.clone({
        setHeaders: {
          Authorization: token
            ? `Bearer ${token}`
            : `Bearer ${environment.tmdbApiReadAccessKey}`,
        },
      })
    );
  }
  ])
}
