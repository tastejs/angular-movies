import {RxState} from '@rx-angular/state';
import {selectSlice} from '@rx-angular/state/selections';
import {inject, Injectable} from '@angular/core';
import {distinctUntilKeyChanged, EMPTY, map, Observable, switchMap, withLatestFrom,} from 'rxjs';
import {TMDBMovieModel} from '../../data-access/api/model/movie.model';
import {TMDBPaginateOptions, TMDBPaginateResult,} from '../../data-access/api/paginate/paginate.interface';
import {DiscoverState} from '../../state/discover.state';
import {Movie, MovieState} from '../../state/movie.state';
import {RouterState} from '../../shared/router/router.state';
import {RouterParams} from '../../shared/router/router.model';
import {infiniteScroll} from '../../shared/cdk/infinite-scroll/infiniteScroll';
import {RxActionFactory} from '@rx-angular/state/actions';
import {InfiniteScrollOptions, InfiniteScrollState,} from '../../shared/cdk/infinite-scroll/infinite-scroll.interface';
import {DiscoverResource} from '../../data-access/api/resources/discover.resource';
import {MovieResource} from '../../data-access/api/resources/movie.resource';
import {SearchResource} from '../../data-access/api/resources/search.resource';
import {GenreResource} from '../../data-access/api/resources/genre.resource';
import {W154H205} from '../../data-access/images/image-sizes';
import {addImageTag} from '../../shared/cdk/image/image-tag.transform';
import {TMDBMovieGenreModel} from '../../data-access/api/model/movie-genre.model';

type MovieListRouterParams = Pick<RouterParams, 'type' | 'identifier'>;
export type MovieListPageModel = InfiniteScrollState<TMDBMovieModel> &
  MovieListRouterParams & { genres: Record<string, TMDBMovieGenreModel> };

const emptyResult$ = EMPTY as unknown as Observable<
  TMDBPaginateResult<TMDBMovieModel>
>;

type Actions = { paginate: void };
function transformToMovieModel(_res: TMDBMovieModel): Movie {
  return addImageTag(_res as Movie, {
    pathProp: 'poster_path',
    dims: W154H205,
    sizes: '(min-width: 600px) 21vw, 15vw',
    srcset: '185w, 342w',
  });
}

@Injectable({
  providedIn: 'root',
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {
  private readonly movieState = inject(MovieState);
  private readonly discoverState = inject(DiscoverState);
  private readonly routerState = inject(RouterState);
  private readonly discoverResource = inject(DiscoverResource);
  private readonly movieResource = inject(MovieResource);
  private readonly searchResource = inject(SearchResource);
  private readonly genreResource = inject(GenreResource);
  private readonly actions = new RxActionFactory<Actions>().create();
  readonly movies$ = this.select(
    map(({ results }) => results?.map(transformToMovieModel))
  );

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
      return this.searchResource.getSearch(identifier);
    }
    return emptyResult$;
  }

  readonly paginate = this.actions.paginate;

  constructor() {
    super();

    const routerParamsFromPaginationTrigger$ = this.actions.paginate$.pipe(
      withLatestFrom(this.routerState.routerParams$),
      map(([, routerParams]) => routerParams)
    );

    this.connect('genres', this.genreResource.getGenresDictionaryCached());

    this.connect(
      this.routerState.routerParams$.pipe(selectSlice(['identifier', 'type']))
    );

    this.connect(
      // paginated results as container state
      this.routerState.routerParams$.pipe(
        // we emit if a change in identifier takes place (search query, category name, genre id)
        distinctUntilKeyChanged('identifier'),
        // we clear the current result on route change with switchMap and restart the initial scroll
        switchMap(({ type, identifier }) =>
          infiniteScroll(
            (options: InfiniteScrollOptions) =>
              getFetchByType(
                type,
                this.movieResource,
                this.discoverResource,
                this.searchResource
              )(identifier, options),
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
  type: RouterParams['type'],
  movieResource: MovieResource,
  discoverResource: DiscoverResource,
  searchResource: SearchResource
): (
  s: string,
  options: TMDBPaginateOptions
) => Observable<TMDBPaginateResult<TMDBMovieModel>> {
  if (type === 'category') {
    return movieResource.getMovieCategory;
  } else if (type === 'search') {
    return searchResource.getSearch;
  } else if (type === 'genre') {
    return (with_genres: string, options: TMDBPaginateOptions) =>
      discoverResource.getDiscoverMovies({ ...options, with_genres });
  }

  return () => emptyResult$;
}
