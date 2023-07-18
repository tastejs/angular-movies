import {Connectable, Observable, publishReplay} from 'rxjs';

/**
 * used for single requests which needs to be fetched only one time and afterwards it is enough to replay e.g. languages, menu items, dynamic app configs, etc.
 * @param fn
 */
export function staticRequest<T, O = T>(
  fn: () => Observable<T>
): () => Observable<O> {
  let _g: Observable<O>;
  return () => {
    if (!_g) {
      _g = fn().pipe(publishReplay(1)) as unknown as Connectable<O>;
      (_g as Connectable<O>).connect();
    }

    return _g;
  };
}
