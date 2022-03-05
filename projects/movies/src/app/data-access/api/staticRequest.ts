import { Observable, OperatorFunction, publishReplay } from 'rxjs';

/**
 * used for single requests which needs to be fetched only one time and afterwards it is enough to replay
 * @param fn
 */
export function staticRequest<T, O = any>(
  fn: () => Observable<T>,
  operator: OperatorFunction<any, O> = (o$) => o$
): () => Observable<O> {
  let _g: Observable<O>;
  return () => {
    if (!_g) {
      _g = fn().pipe(operator, publishReplay(1)) as any;
      (_g as any).connect();
    }

    return _g;
  };
}
