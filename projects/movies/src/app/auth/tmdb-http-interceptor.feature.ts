import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lazyInject } from '../shared/lazy-inject';
import { switchMap } from 'rxjs';

const LazyAuthState = () => import('../state/auth.state').then(x => x.AuthState);

export const tmdbReadAccessInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return lazyInject(LazyAuthState).pipe(
    switchMap((authState) => {
      const token = authState.get('accessToken');

      return next(
        req.clone({
          setHeaders: {
            Authorization: token
              ? `Bearer ${token}`
              : `Bearer ${environment.tmdbApiReadAccessKey}`,
          },
        })
      );
    })
  );
};
