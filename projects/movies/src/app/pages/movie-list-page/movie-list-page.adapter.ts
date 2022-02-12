import { RxState } from '@rx-angular/state';
import { Injectable } from '@angular/core';
import {
  distinctUntilKeyChanged,
  EMPTY,
  map,
  Observable,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { getMovieCategory } from '../../data-access/api/resources/movie.resource';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import {
  TMDBPaginateOptions,
  TMDBPaginateResult,
} from '../../data-access/api/paginate/paginate.interface';
import { DiscoverState } from '../../shared/state/discover.state';
import { MovieState } from '../../shared/state/movie.state';
import { RouterParams, RouterState } from '../../shared/state/router.state';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { getActions } from '../../shared/rxa-custom/actions';
import {
  InfiniteScrollOptions,
  InfiniteScrollState,
} from '../../shared/cdk/infinite-scroll/infinite-scroll.interface';
import { getSearch } from '../../data-access/api/resources/search.resource';

type MovieListRouterParams = Pick<RouterParams, 'type' | 'identifier'>;
type MovieListPageModel = InfiniteScrollState<TMDBMovieModel> &
  MovieListRouterParams;

const emptyResult$ = EMPTY as unknown as Observable<
  TMDBPaginateResult<TMDBMovieModel>
>;

@Injectable({
  providedIn: 'root',
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {
  private readonly actions = getActions<{ paginate: void }>();

  getInitialFetchByType({
    type,
    identifier,
  }: Omit<RouterParams, 'layout'>): Observable<
    TMDBPaginateResult<TMDBMovieModel>
  > {
    if (type === 'category') {
      return this.movieState
        .categoryMoviesByIdCtx(identifier)
        .pipe(map(({ loading, value }) => ({ loading, ...value })));
    } else if (type === 'genre') {
      return this.discoverState
        .genreMoviesByIdSlice(identifier)
        .pipe(map(({ loading, value }) => ({ loading, ...value })));
    } else if (type === 'search') {
      return getSearch(identifier);
    }
    return emptyResult$;
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
          infiniteScroll(
            (options: InfiniteScrollOptions) =>
              getFetchByType(type)(identifier, options),
            routerParamsFromPaginationTrigger$,
            this.getInitialFetchByType({ type, identifier })
          )
        )
      )
    );

    this.hold(this.routerState.routerParams$, this.routerFetchEffect);
  }

  private routerFetchEffect = ({
    layout,
    type,
    identifier,
  }: RouterParams): void => {
    if (layout === 'list' && type === 'category') {
      this.movieState.fetchCategoryMovies(identifier);
    } else if (layout === 'list' && type === 'genre') {
      this.discoverState.fetchDiscoverGenreMovies(identifier);
    }
  };
}

function getFetchByType(
  type: RouterParams['type']
): (
  s: string,
  options: TMDBPaginateOptions
) => Observable<TMDBPaginateResult<TMDBMovieModel>> {
  if (type === 'category') {
    return getMovieCategory;
  } else if (type === 'search') {
    return getSearch;
  } else if (type === 'genre') {
    return (with_genres: string, options: TMDBPaginateOptions) =>
      getDiscoverMovies({ ...options, with_genres });
  }

  return (_: string, __?: TMDBPaginateOptions) => emptyResult$;
}
