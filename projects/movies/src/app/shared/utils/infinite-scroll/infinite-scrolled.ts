import { concatMap, filter, Observable, tap } from 'rxjs';
import { withLoadingEmission } from '../withLoadingEmissions';
import { PaginationOptions, PaginationState } from './paginate-state.interface';

export function infiniteScrolled<T, I>(
  fetchFn: (
    param: I,
    paginationOptions: PaginationOptions
  ) => Observable<T & { totalPages: number }>
) {
  let _activePage = 1;
  let _totalPages = 2;
  return (o$: Observable<I>): Observable<Partial<T & PaginationState>> =>
    o$.pipe(
      filter(() => _activePage < _totalPages),
      concatMap((trigger: I) => {
        return fetchFn(trigger, { page: ++_activePage }).pipe(
          tap(({ totalPages }) => (_totalPages = totalPages)),
          withLoadingEmission()
        );
      })
    ) as Observable<Partial<T & PaginationState>>;
}
