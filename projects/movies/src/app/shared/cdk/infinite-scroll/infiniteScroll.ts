import {insert, patch} from '@rx-angular/cdk/transformations';
import {concat, concatMap, EMPTY, map, Observable, scan, takeWhile,} from 'rxjs';
import {withLoadingEmission} from '../loading/withLoadingEmissions';
import {InfiniteScrollOptions, InfiniteScrollResult, InfiniteScrollState,} from './infinite-scroll.interface';
import {coerceObservable} from '../coerceObservable';

type PartialInfiniteScrollState<T> = Partial<InfiniteScrollState<T>>;

/**
 *
 * A helper function to trigger HTTP requests on a paginated API.
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
 * const paginated$: Observable<{list: any[]} & PaginatedState> =
 *    infiniteScrolled(
 *      (options, triggerID) => fetchList(triggerID, options.page).pipe(mapToPaginationResult()),
 *     load$.pipe(mapTo(activeListId)),
 *     // optional start page, default 0, e.g. {page: 4}, of({page: 4, result: any[]})
 *     // Notice: If an Observable is passed the result will also be emitted as first value.
 *    )
 * );
 *
 * @example
 * const infiniteList$ = infiniteScrolled(
 *   (options) => getDiscoverMovies(identifier, options),
 *   this.actions.paginate$,
 *   getDiscoverMovies(identifier, { page: 1 })
 * );
 *
 */
export function infiniteScroll<T>(
  fetchFn: (
    incrementedOptions: InfiniteScrollOptions
  ) => Observable<PartialInfiniteScrollState<T>>,
  trigger$: Observable<unknown>,
  initialPageOrLastResult:
    | InfiniteScrollResult<unknown>
    | Observable<InfiniteScrollResult<T>> = {} as InfiniteScrollResult<unknown>
): Observable<InfiniteScrollState<T>> {
  let page = 0;
  let total_pages = 2;

  // We need to reduce the initial page by one as we start by incrementing it
  const initialResult$ = coerceObservable(initialPageOrLastResult).pipe(
    map((s) => {
      const { page: _page, total_pages: _total_pages, ...rest } = s;
      // if no start result is given start with page 0, total pages 2 => next request will be page 1
      // if no initial result is given start with an empty list
      page = _page || page;
      total_pages = _total_pages || total_pages;
      return {
        page,
        total_pages,
        ...rest,
      } as InfiniteScrollState<T>;
    }),
    // in case there is global state connected we take care of just taking the initial value that includes a result.
    // loading emissions are forwarded as they are and merged into the result stream. This "forwards" the possible inflight state of the initial result.
    takeWhile((r) => !Array.isArray(r.results), true)
  );

  return concat(
    initialResult$.pipe(withLoadingEmission()),
    trigger$.pipe(
      concatMap(() => {
        ++page;
        return page <= total_pages
          ? fetchFn({ page }).pipe(withLoadingEmission())
          : (EMPTY as unknown as Observable<PartialInfiniteScrollState<T>>);
      })
    )
  ).pipe(
    scan(
      (
        acc: InfiniteScrollState<T>,
        response: PartialInfiniteScrollState<T>
      ) => {
        // in case the initial value was no set we take total pages from the result
        if (response?.total_pages) {
          total_pages = response.total_pages;
        }
        // Only treas results if they are given.
        // Avoid emitting unnecessary empty arrays which cause render filcker and bad performance
        if (response?.results) {
          acc.results = insert(acc?.results, response?.results || []);
          delete response.results;
        }
        // the rest gets updated
        return patch(acc, response);
      },
      { page, total_pages } as unknown as InfiniteScrollState<T>
    )
  );
}
