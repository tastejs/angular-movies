import { Observable, publishReplay } from 'rxjs';

/**
 * used for single requests which needs to be fetched only one time and afterwards it is enough to replay e.g. languages, menu items, dynamic app configs, etc.
 * @param fn
 */
export function staticRequest<T, O = any>(
  fn: () => Observable<T>
): () => Observable<O> {
  let _g: Observable<O>;
  return () => {
    if (!_g) {
      _g = fn().pipe(publishReplay(1)) as any;
      (_g as any).connect();
    }

    return _g;
  };
}
