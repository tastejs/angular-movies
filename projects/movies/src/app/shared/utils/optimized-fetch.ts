import { exhaustMap, groupBy, map, mergeAll, Observable } from 'rxjs';

/**
 * **🚀 Perf Tip for TTI, TBT:**
 *
 * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
 *
 * E.g.:
 * Subsequent HTTP get requests to the URLs api/1 -> api/2 -> api/1 can lead to over fetching of api/1 if the first request is still pending
 * The following logic avoids this.
 */
export function optimizedFetch<T, K, O>(
  groupSelector: (value: T) => K,
  fetch: (t: T) => Observable<O>
): (o$: Observable<T>) => Observable<O> {
  return (o$: Observable<T>) =>
    o$.pipe(
      groupBy(groupSelector),
      // exhaust by keySelector e.g. url
      map((t$) => t$.pipe(exhaustMap(fetch))),
      mergeAll()
    );
}
