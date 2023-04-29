import {withInterceptors} from "@angular/common/http";

export function withTmdbContentTypeInterceptors() {
  return withInterceptors([(req, next) => {
    return next(
      req.clone({setHeaders: {'Content-Type': 'application/json;charset=utf-8'}})
    );
  }])
}
