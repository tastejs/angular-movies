import { Injectable } from '@angular/core';
import { insert, RxState, selectSlice } from '@rx-angular/state';
import { distinctUntilKeyChanged, EMPTY, filter, map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { getMovieCategory } from '../../data-access/api/resources/movie.resource';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import { TMDBPaginationOptions } from '../../data-access/api/model/pagination.interface';
import { DiscoverState } from '../../shared/state/discover.state';
import { MovieState } from '../../shared/state/movie.state';
import { RouterState } from '../../shared/state/router.state';
import { infiniteScrolled } from '../../shared/utils/infinite-scroll/infinite-scrolled';
import { RouterParams } from '../../shared/state/router-state.interface';
import { PaginatedResult } from '../../shared/state/typings';
import { getActions } from '../../shared/rxa-custom/actions';
import { InfiniteScrollState, PaginationOptions } from '../../shared/utils/infinite-scroll/paginate-state.interface';

type MovieListRouterParams = Pick<RouterParams, 'type' | 'identifier'>
type MovieListPageModel = InfiniteScrollState<TMDBMovieModel> & MovieListRouterParams;

function listChanged(oldP: any, newP: any): boolean {
  return oldP?.type !== newP?.type || oldP?.identifier !== newP?.identifier;
}

function getFetchByType(type: RouterParams['type']): (i: string, options?: TMDBPaginationOptions) => Observable<PaginatedResult<TMDBMovieModel>> {
  if (type === 'category') {
    return getMovieCategory;
  } else if (type === 'genre' || type === 'search') {
    return getDiscoverMovies;
  }
  return (_: string, __?: TMDBPaginationOptions) => EMPTY as unknown as Observable<PaginatedResult<TMDBMovieModel>>;
}

@Injectable({
  providedIn: 'root'
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {

  private readonly actions = getActions<{ paginate: void }>();
  private readonly initialCategoryMovieList$ = (identifier: string) => this.movieState.select(
    selectSlice(['categoryMovies', 'categoryMoviesLoading']),
    // only forward if loading is finished and items are present
    filter(({ categoryMovies, categoryMoviesLoading }) => !categoryMoviesLoading && Array.isArray(categoryMovies[identifier]?.results)),
    map(
      ({ categoryMovies: idMap, categoryMoviesLoading: loading }) =>
        // Add loading and if results is empty set it to []
        ({ loading, ...((idMap && idMap[identifier]) || { results: [] }) }) as MovieListPageModel
    )
  );
  private readonly initialDiscoverMovieList$: (i: string) => Observable<MovieListPageModel> = (identifier: string) => this.discoverState.select(
    selectSlice(['discoveredMovies', 'discoveredMoviesLoading']),
    // only forward if loading is finished and items are present
    filter(({ discoveredMovies, discoveredMoviesLoading }) => !discoveredMoviesLoading && Array.isArray(discoveredMovies[identifier]?.results)),
    map(
      ({ discoveredMovies: idMap, discoveredMoviesLoading: loading }) =>
        // Add loading and if results is empty set it to []
        ({ loading, ...((idMap && idMap[identifier]) || { results: [] }) }) as MovieListPageModel
    )
  );

  readonly paginate = this.actions.paginate;

  constructor(
    private movieState: MovieState,
    private discoverState: DiscoverState,
    private routerState: RouterState
  ) {
    super();

    const routerParamsFromPaginationTrigger$: Observable<MovieListRouterParams> = this.actions.paginate$.pipe(
      withLatestFrom(this.routerState.routerParams$),
      map(([_, routerParams]) => routerParams)
    );

    // paginated results as container state
    this.connect(
      this.routerState.routerParams$.pipe(
        // we clear the current result on route change with switchMap and restart
        distinctUntilKeyChanged('identifier'),
        switchMap(({ type, identifier }) => infiniteScrolled(
          // data fetch functions
          (paginationOptions: PaginationOptions, { type, identifier }) => getFetchByType(type)(identifier, paginationOptions)
            .pipe(map((r) => ({ ...r, type, identifier }))),
          // trigger from infinite scroll list
          routerParamsFromPaginationTrigger$,
          // initial value
          (type === 'category' ? this.initialCategoryMovieList$(identifier) : this.initialDiscoverMovieList$(identifier)).pipe(
            map((r) => ({ ...r, type, identifier }))
          )
          )
        )
      ),
      (oldState, newSlice) => {
        if (newSlice?.results) {
          newSlice.results = listChanged(oldState, newSlice) ? newSlice.results : insert(oldState.results, newSlice.results);
        }
        return newSlice;
      }
    );
  }

}
