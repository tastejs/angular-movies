import { concatMap, EMPTY, expand, isObservable, map, Observable, of, take, tap } from 'rxjs';
import { PaginatedResult } from '../../state/typings';
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
  const initialResult$ = (isObservable(initialState) ? initialState : of(initialState)).pipe(
    map((s) => {
      const { page, totalPages, ...rest } = s;
      // if no start result is given start with page 0, total pages 2 => next request will be page 1
      // if no initial result is given start with an empty list
      return { page: page ? page : 0, totalPages: totalPages || 2, ...rest } as PaginatedResult<T>;
    }),
    // in case there is global state connected we take care of just taking the initial value
    take(1),
    tap(v => console.log('infiniteScrolled#initialResult$: ', v))
  );
  let page: number = 0;
  let totalPages: number = 0;
  return initialResult$.pipe(
    expand((result) => {
      console.log('infiniteScrolled#result: ', result);

      let nextRequest$: Observable<InfiniteScrolleState<T>> = EMPTY as unknown as Observable<InfiniteScrolleState<T>>;
      const empty$ = EMPTY as unknown as Observable<InfiniteScrolleState<T>>;
      // if it is a emission with a response ( hacky :( )
      if ('page' in result && 'totalPages' in result) {
        page = result.page + 1;
        totalPages = result.totalPages;

        nextRequest$ = (page < totalPages ? trigger$.pipe(
          concatMap((triggerParams: I) => fetchFn({ page }, triggerParams).pipe(withLoadingEmission()) as Observable<InfiniteScrolleState<T>>),
          tap(v => console.log('infiniteScrolled#fetchFn$: ', v))
        ) : empty$);
      }

      console.log('infiniteScrolled(page < result.totalPages): ', page, totalPages, page < totalPages);

      return nextRequest$;
    })
  );
}
