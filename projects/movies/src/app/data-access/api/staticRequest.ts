import { Observable, publishReplay } from 'rxjs';

/**
 * used for single requests which needs to be fetched only one time and afterwards it is enough to replay
 * @param fn
 */
export function staticRequest<T>(fn: () => Observable<T>): () => Observable<T> {
  let _g: Observable<T>;
  return () => {
    if (!_g) {
      _g = fn().pipe(publishReplay(1)) as any;
      (_g as any).connect();
    }

    return _g;
  };
}
