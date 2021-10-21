import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStateService } from './auth.state';

@Injectable({
  providedIn: 'root',
})
export class ReadAccessInterceptor implements HttpInterceptor {
  constructor(private authService: AuthStateService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.state.getValue().accessToken;

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
