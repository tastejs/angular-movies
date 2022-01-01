import { EMPTY, exhaustMap, expand, map, Observable, take } from 'rxjs';
import { PaginatedResult } from '../../state/typings';
import { coerceObservable } from '@rx-angular/cdk';

export type PaginationOptions = { page: number, totalPages?: number };

export type InfiniteScrolleState<T> = Partial<PaginatedResult<T>> & {
  loading?: boolean
}

/**
 *
 * A helper function to trigger HTTP requesty on a paginated API.
 *
 * @example
 *
 * // To paginate a resource we need at minimal 2 things, the page number and the total pages.
 *
 * // Let's say you want to paginate the following http request:
 *  fetchList(id: number, pageNumber: number): Observable<{result: any[], total_pages: number}>
 *
 * // We want to get the result under the name `list`, not `results` as the APi provides.
 * // In this function the active page is hidden but the total pages is needed and named `totalPages`, so we need to map it too
 * const mapToPaginationResult = () => map(({ results, total_pages }) => ({list: results, totalPages: total_pages}))
 *
 * // And following trigger to fetch the new page:
 * load$: Observable<void>;
 *
 * // the implementation for a static id would lok like this:
 * const activeListId = 42;
 *
 * const paginated$: Observable<{list: any[]} & PaginatedState> = load$.pipe(
 *    mapTo(activeListId),
 *    infiniteScrolled(
 *      (triggerID, options) => fetchList(triggerID, options.page)
 *        .pipe(mapToPaginationResult())
 *    )
 * );
 *
 * @param fetchFn - a function that takes a param and pagination options
 */
export function infiniteScrolled<T>(
  trigger$: Observable<any>,
  fetchFn: (result: PaginationOptions, triggerParams: any) => Observable<PaginatedResult<T>>,
  initialState: InfiniteScrolleState<T> | Observable<InfiniteScrolleState<T>> = {} as InfiniteScrolleState<T>
): Observable<InfiniteScrolleState<T>> {
  const empty$ = EMPTY as unknown as Observable<InfiniteScrolleState<T>>;
  // We need to reduce the initial page by one as we start by incrementing it
  const initialResult$ = coerceObservable(initialState).pipe(
    map((s) => {
      const { page, totalPages, ...rest } = s;
      return { page: page ? page - 1 : 0, totalPages: totalPages || 2, ...rest };
    }),
    // in case there is global state connected we take care of just taking the initial value
    take(1)
  );

  return initialResult$.pipe(
    expand((result) => {
      const page = result.page + 1;
      const nextRequest$ = trigger$.pipe(
        exhaustMap((triggerParams) => fetchFn({ page }, triggerParams) as Observable<InfiniteScrolleState<T>>)
      );
      return (page < result.totalPages ? nextRequest$ : empty$);
    })
  );
}

