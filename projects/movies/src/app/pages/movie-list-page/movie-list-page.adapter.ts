import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { concat, EMPTY, map, Observable, Subject, take, tap, withLatestFrom } from 'rxjs';
import { MovieModel } from '../../data-access/model/movie.model';
import { getMovieCategory } from '../../data-access/api/movie.resource';
//import { getMoviesSearch } from '../../data-access/api/search.resource';
//import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
//import { DiscoverState } from '../../shared/state/discover.state';
//import { GenreState } from '../../shared/state/genre.state';
//import { withLoadingEmission } from '../../shared/utils/withLoadingEmissions';
import { MovieState } from '../../shared/state/movie.state';
import { RouterState } from '../../shared/state/router.state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { infiniteScrolled, PaginationOptions } from '../../shared/utils/infinite-scroll/infinite-scrolled';
import { PaginationState } from '../../shared/utils/infinite-scroll/paginate-state.interface';
import { getDiscoverMovies } from '../../data-access/api/discover.resource';
import { TMDBPaginationOptions } from '../../data-access/model/pagination.interface';
import { RouterParams } from '../../shared/state/router-state.interface';
import { PaginatedResult } from '../../shared/state/typings';

type MovieListPageModel = PaginationState<MovieModel> &
  {
    type: string;
    identifier: string;
  };

function getFetchByType(type: RouterParams['type']): (i: string, options?: TMDBPaginationOptions) => Observable<PaginatedResult<MovieModel>> {
  if (type === 'category') {
    return getMovieCategory;
  } else if (type === 'genre' || type === 'search') {
    return getDiscoverMovies;
  }
  return (_: string, __?: TMDBPaginationOptions) => EMPTY as unknown as Observable<PaginationState<MovieModel>>;
}

@Injectable({
  providedIn: 'root'
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {
  routerSearch$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('search', 'list')
  );

  routerGenre$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('genre', 'list')
  );
  routerCategory$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('category', 'list')
  );

  private readonly paginate$ = new Subject<void>();

  private readonly initialCategoryMovieList$ = this.movieState.select(
    selectSlice([
      'categoryMovies',
      'categoryMoviesContext'
    ]),
    withLatestFrom(this.routerCategory$),
    map(
      ([
         { categoryMovies, categoryMoviesContext },
         indentifier
       ]) => {
        return {
          indentifier,
          loading: categoryMoviesContext,
          results: (categoryMovies && categoryMovies[indentifier]) || null
        };
      }
    )
  );

  /*
      _slice$ = combineLatest({
        genres: this.genreState.select('genres'),
        discoverSlice: this.discoverState.select(
          selectSlice(['discoveredMovies', 'discoveredMoviesContext'])
        )
      }).pipe(
        map(({ genres, discoverSlice }) => ({ genres, ...discoverSlice })),
        selectSlice(['genres', 'discoveredMovies', 'discoveredMoviesContext'])
      );

        private readonly genreMovieList$ = this._slice$.pipe(
          withLatestFrom(this.routerGenre$),
          map(([{ genres, discoveredMovies, discoveredMoviesContext }, genreParam]) => {
            const genreIdStr = genreParam as unknown as string;
            const genreId = parseInt(genreIdStr, 10);
            const genreName =
              genres.find((g: MovieGenreModel) => g.id === genreId)?.name ||
              'unknown genre';
            return {
              loading: discoveredMoviesContext,
              title: parseTitle(genreName),
              type: 'genre',
              results: (discoveredMovies && discoveredMovies[genreIdStr]) || null
            };
          })
        );

        private readonly searchMovieList$ = this.routerSearch$.pipe(
          // cancel previous requests
          switchMap((query) =>
            getMoviesSearch(query).pipe(
              map(
                ({ results }) =>
                  ({
                    results: results || null,
                    title: parseTitle(query)
                  })
              ),
              withLoadingEmission('loading')
            )
          )
        );

        private readonly initialPageFromRoutedMovieList$ = this.routerState.routerParams$.pipe(
          switchMap(({ type }) =>
            type === 'genre'
              ? this.genreMovieList$
              : type === 'category'
              ? this.initialCategoryMovieList$
              : this.searchMovieList$
          )
        );
     */

  constructor(
    private movieState: MovieState,
    /*private discoverState: DiscoverState,
     private genreState: GenreState,
    */ private routerState: RouterState
  ) {
    super();
    this.set({
      results: []
    });
    this.initialCategoryMovieList$;
    // const u = <T>({ type, identifier }) => ({page}: PaginatedResult<T>) => getFetchByType(type)(identifier, { page })
    const routerParamsFromPaginationTrigger$ = this.paginate$.pipe(
      withLatestFrom(this.routerState.routerParams$),
      map(([_, routerParams]) => routerParams)
    );
    this.initialCategoryMovieList$.pipe(take(1));
    // paginated results as container state
    this.connect(
      concat(
        // Initial page cached for instant result after navigation the first page result is cached in a global state service
        // this.initialCategoryMovieList$.pipe(take(1)),
        infiniteScrolled(
          routerParamsFromPaginationTrigger$.pipe(tap(v => console.log('routerParamsFromPaginationTrigger$: ', v))),
          (paginationOptions: PaginationOptions, { type, identifier }) => {
            return getFetchByType(type)(identifier, paginationOptions)
          }
        ).pipe(tap(v => console.log('after scroll: ', v)))
      ),
      ({ results }, newSlice) => {
        if (newSlice?.results) {
          newSlice.results = results.concat(newSlice.results);
        }
        return newSlice;
      }
    );
  }

  paginate() {
    this.paginate$.next();
  }
}
