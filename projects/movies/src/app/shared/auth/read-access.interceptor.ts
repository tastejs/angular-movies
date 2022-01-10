import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthState } from './auth.state';

@Injectable({
  providedIn: 'root',
})
export class ReadAccessInterceptor implements HttpInterceptor {
  constructor(private authService: AuthState) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.get().accessToken;

    return next.handle(
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
