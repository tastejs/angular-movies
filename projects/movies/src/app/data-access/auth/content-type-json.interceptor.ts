import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentTypeJsonInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
    return next.handle(
      req.clone({
        setHeaders: { 'Content-Type': 'application/json;charset=utf-8' },
      })
    );
  }
}
