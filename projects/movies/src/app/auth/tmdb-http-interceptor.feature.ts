import { HttpInterceptorFn, withInterceptors} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthState} from "../state/auth.state";
import {environment} from "../../environments/environment";

export function withTmdbInterceptors() {
  return withInterceptors([
    withTmdbContentTypeInterceptors(),
    withTmdbReadAccessInterceptors()
  ])
}

export function withTmdbContentTypeInterceptors(): HttpInterceptorFn {
  return (req, next) => {
    return next(
      req.clone({setHeaders: {'Content-Type': 'application/json;charset=utf-8'}})
    );
  }
}

export function withTmdbReadAccessInterceptors(): HttpInterceptorFn {
  return (req, next) => {
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
}
