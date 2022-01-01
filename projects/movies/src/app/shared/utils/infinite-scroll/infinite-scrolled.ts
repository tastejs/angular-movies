import { concatMap, EMPTY, expand, map, Observable, take, tap } from 'rxjs';
import { PaginatedResult } from '../../state/typings';
import { coerceObservable } from '@rx-angular/cdk';
import { LoadingState, withLoadingEmission } from '../withLoadingEmissions';

export type PaginationOptions = { page: number, totalPages?: number };

export type InfiniteScrolleState<T extends {}> = PaginatedResult<T> & LoadingState<'loading'>;


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
export function infiniteScrolled<T, I extends {}>(
  fetchFn: (result: PaginationOptions, triggerParams: I) => Observable<Partial<InfiniteScrolleState<any>>>,
  trigger$: Observable<I>,
  initialState: PaginatedResult<any> | Observable<PaginatedResult<T>> = {} as PaginatedResult<any>
): Observable<Partial<InfiniteScrolleState<T>>> {
  // We need to reduce the initial page by one as we start by incrementing it
  const initialResult$ = coerceObservable(initialState).pipe(
    map((s) => {
      const { page, totalPages, ...rest } = s;
      // if no start result is given start with page 0, total pages 2 => next request will be page 1
      // if no initial result is given start with an empty list
      return { page: page ? page : 0, totalPages: totalPages || 2, ...rest } as PaginatedResult<T>;
    }),
    // in case there is global state connected we take care of just taking the initial value
    take(1),
    tap(v => console.log('infiniteScrolled#initialResult$: ', v)),
  );

  return initialResult$.pipe(
    expand((result) => {
      const page = result.page + 1;
      const nextRequest$ = trigger$.pipe(
        tap(v => console.log('infiniteScrolled#trigger$: ', v)),
        concatMap((triggerParams: I) => fetchFn({ page }, triggerParams).pipe(withLoadingEmission())),
        tap(v => console.log('infiniteScrolled#fetchFn$: ', v)),
      );

      console.log('infiniteScrolled(page < result.totalPages): ', page < result.totalPages)
      const empty$ = EMPTY as unknown as Observable<InfiniteScrolleState<T>>;
      return (page < result.totalPages ? nextRequest$ : empty$);
    })
  );
}
