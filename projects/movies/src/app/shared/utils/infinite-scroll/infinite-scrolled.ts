import { EMPTY, exhaustMap, expand, Observable, of, tap } from 'rxjs';
import { PaginatedResult } from '../../state/typings';
import { withLoadingEmission } from '../withLoadingEmissions';

export type PaginationOptions = { page: number, totalPages?: number };

type InfiniteScrolleState<T> = Partial<PaginatedResult<T>> & Pick<PaginatedResult<T>, 'page' | 'totalPages'> & {
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
 *  fetchList(id: nuber, pageNumber: number): Observable<{result: any[], total_pages: number}>
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
 * const paginated$: Obaservabls<{list: any[]} & PaginatedState> = load$.pipe(
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
  initialState: PaginatedResult<T> = {} as PaginatedResult<T>
): Observable<InfiniteScrolleState<T>> {
  const empty$ = EMPTY as unknown as Observable<InfiniteScrolleState<T>>;
  const { page, totalPages } = initialState;
  // We need to reduce the initial page by one as we start by incrementing it
  const infiniteScrollState = { page: page ? page - 1 : 0, totalPages: totalPages || 2, results: [] };

  return of(infiniteScrollState).pipe(
    expand((result) => {
      const page = result.page + 1;
      const nextRequest$ = trigger$.pipe(
        tap(v => console.log('trigger: ', v, page, result.totalPages)),                            //   @TODO fix typing
        exhaustMap((triggerParams) => fetchFn({ page }, triggerParams).pipe(tap(v => console.log('http res: ', v, page, result.totalPages))) as Observable<InfiniteScrolleState<T>>)
      );
      console.log('expand new page: ', page, ' totalPages: ', result.totalPages)
      return (page < result.totalPages ? nextRequest$ : empty$);
    })
  );
}

withLoadingEmission();
