import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import {
  distinctUntilKeyChanged,
  EMPTY,
  filter,
  map,
  Observable,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { getMovieCategory } from '../../data-access/api/resources/movie.resource';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import { TMDBPaginationOptions } from '../../data-access/api/model/pagination.interface';
import { DiscoverState } from '../../shared/state/discover.state';
import { MovieState } from '../../shared/state/movie.state';
import { RouterState } from '../../shared/state/router.state';
import { infiniteScrolled } from '../../shared/cdk/infinite-scroll/infinite-scrolled';
import { RouterParams } from '../../shared/state/router-state.interface';
import { PaginatedResult } from '../../shared/state/typings';
import { getActions } from '../../shared/rxa-custom/actions';
import {
  InfiniteScrollState,
  PaginationOptions,
} from '../../shared/cdk/infinite-scroll/paginate-state.interface';
import { getSearch } from '../../data-access/api/resources/search.resource';

type MovieListRouterParams = Pick<RouterParams, 'type' | 'identifier'>;
type MovieListPageModel = InfiniteScrollState<TMDBMovieModel> &
  MovieListRouterParams;

@Injectable({
  providedIn: 'root',
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {
  private readonly actions = getActions<{ paginate: void }>();
  private readonly initialCategoryMovieList$ = (identifier: string) =>
    this.movieState.select(
      selectSlice(['categoryMovies', 'categoryMoviesLoading']),
      // only forward if loading is finished and items are present
      filter(
        ({ categoryMovies, categoryMoviesLoading }) =>
          !categoryMoviesLoading &&
          Array.isArray(categoryMovies[identifier]?.results)
      ),
      map(
        ({ categoryMovies: idMap, categoryMoviesLoading: loading }) =>
          // Add loading and if results is empty set it to []
          ({
            loading,
            ...((idMap && idMap[identifier]) || { results: [] }),
          } as MovieListPageModel)
      )
    );
  private readonly initialDiscoverMovieList$: (
    i: string
  ) => Observable<MovieListPageModel> = (identifier: string) =>
    this.discoverState.select(
      selectSlice(['discoveredMovies', 'discoveredMoviesLoading']),
      filter(
        ({ discoveredMovies, discoveredMoviesLoading }) =>
          !discoveredMoviesLoading &&
          Array.isArray(discoveredMovies[identifier]?.results)
      ),
      map(
        ({ discoveredMovies: idMap, discoveredMoviesLoading: loading }) =>
          ({
            loading,
            ...((idMap && idMap[identifier]) || { results: [] }),
          } as MovieListPageModel)
      )
    );

  initialFetchByType({
    type,
    identifier,
  }: Omit<RouterParams, 'layout'>): Observable<
    PaginatedResult<TMDBMovieModel>
  > {
    return type === 'category'
      ? this.initialCategoryMovieList$(identifier).pipe(
          map(({ page, ...r }) => ({ ...r, page: page - 1 }))
        )
      : this.initialDiscoverMovieList$(identifier).pipe(
          map(({ page, ...r }) => ({ ...r, page: page - 1 }))
        );
  }

  readonly paginate = this.actions.paginate;

  constructor(
    private movieState: MovieState,
    private discoverState: DiscoverState,
    private routerState: RouterState
  ) {
    super();

    const routerParamsFromPaginationTrigger$: Observable<MovieListRouterParams> =
      this.actions.paginate$.pipe(
        withLatestFrom(this.routerState.routerParams$),
        map(([_, routerParams]) => routerParams)
      );

    this.connect(
      // paginated results as container state
      this.routerState.routerParams$.pipe(
        // we emit if a change in emit identifier takes place (search query, category name, genre id)
        distinctUntilKeyChanged('identifier'),
        // we clear the current result on route change with switchMap and restart the initial scroll
        switchMap(({ type, identifier }) =>
          infiniteScrolled(
            // data fetch functions by type (search, category, genre)
            (paginationOptions: PaginationOptions) =>
              getFetchByType(type)(identifier, paginationOptions),
            // trigger from infinite scroll list
            routerParamsFromPaginationTrigger$,
            // initial result and page
            this.initialFetchByType({ type, identifier })
          )
        )
      )
    );
  }
}

function getFetchByType(
  type: RouterParams['type']
): (
  s: string,
  options: TMDBPaginationOptions
) => Observable<PaginatedResult<TMDBMovieModel>> {
  if (type === 'category') {
    return getMovieCategory;
  } else if (type === 'search') {
    return getSearch;
  } else if (type === 'genre') {
    return (with_genres: string, options: TMDBPaginationOptions) =>
      getDiscoverMovies({ ...options, with_genres });
  }

  return (_: string, __?: TMDBPaginationOptions) =>
    EMPTY as unknown as Observable<PaginatedResult<TMDBMovieModel>>;
}
