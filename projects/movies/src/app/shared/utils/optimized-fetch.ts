import { exhaustMap, groupBy, map, mergeAll, Observable } from 'rxjs';

export function optimizedFetch<T, K, O>(
  keySelector: (value: T) => K,
  fetch: (t: T) => Observable<O>
): (o$: Observable<T>) => Observable<O> {
  return (o$: Observable<T>) => o$.pipe(
    groupBy(keySelector),
    map(t$ => t$.pipe(exhaustMap(fetch))),
    mergeAll()
  );
}

