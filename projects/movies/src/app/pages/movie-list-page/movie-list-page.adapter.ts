import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import {
  combineLatest,
  map,
  Observable,
  Subject,
  switchMap,
  switchMapTo,
  withLatestFrom,
} from 'rxjs';
import { getMovieCategory } from '../../data-access/api/movie.resource';
import { getMoviesSearch } from '../../data-access/api/search.resource';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { MovieModel } from '../../data-access/model/movie.model';
import { DiscoverState } from '../../shared/state/discover.state';
import { GenreState } from '../../shared/state/genre.state';
import { MovieState } from '../../shared/state/movie.state';
import { RouterState } from '../../shared/state/router.state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { infiniteScrolled } from '../../shared/utils/infinite-scroll/infinite-scrolled';
import { PaginationState } from '../../shared/utils/infinite-scroll/paginate-state.interface';
import { parseTitle } from '../../shared/utils/parse-movie-list-title';
import { withLoadingEmission } from '../../shared/utils/withLoadingEmissions';

type MovieListPageModel = PaginationState & {
  loading: boolean;
  movies: MovieModel[];
  title: string;
  type: string;
  activeCategory: string;
};

@Injectable({
  providedIn: 'root',
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

  private readonly initialCategoryMovieList$: Observable<MovieListPageModel> =
    this.movieState.select(
      selectSlice([
        'categoryMovies',
        'categoryMoviesContext',
        'categoryMoviesTotalPages',
      ]),
      withLatestFrom(this.routerCategory$),
      map(
        ([
          { categoryMovies, categoryMoviesContext, categoryMoviesTotalPages },
          listName,
        ]) => {
          return {
            activePage: 1,
            totalPages: categoryMoviesTotalPages[listName],
            loading: categoryMoviesContext,
            title: parseTitle(listName),
            activeCategory: listName,
            type: 'category',
            movies: (categoryMovies && categoryMovies[listName]) || null,
          };
        }
      )
    );

  _slice$ = combineLatest({
    genres: this.genreState.select('genres'),
    discoverSlice: this.discoverState.select(
      selectSlice(['genreMovies', 'genreMoviesContext'])
    ),
  }).pipe(
    map(({ genres, discoverSlice }) => ({ genres, ...discoverSlice })),
    selectSlice(['genres', 'genreMovies', 'genreMoviesContext'])
  );

  private readonly genreMovieList$ = this._slice$.pipe(
    withLatestFrom(this.routerGenre$),
    map(([{ genres, genreMovies, genreMoviesContext }, genreParam]) => {
      const genreIdStr = genreParam as unknown as string;
      const genreId = parseInt(genreIdStr, 10);
      const genreName =
        genres.find((g: MovieGenreModel) => g.id === genreId)?.name ||
        'unknown genre';
      return {
        loading: genreMoviesContext,
        title: parseTitle(genreName),
        type: 'genre',
        movies: (genreMovies && genreMovies[genreIdStr]) || null,
      };
    })
  );

  private readonly searchMovieList$: Observable<
    MovieListPageModel | { loading: boolean }
  > = this.routerSearch$.pipe(
    // cancel previous requests
    switchMap((query) =>
      getMoviesSearch(query).pipe(
        map(
          ({ results }) =>
            ({
              movies: results || null,
              title: parseTitle(query),
            } as MovieListPageModel)
        ),
        withLoadingEmission('loading')
      )
    )
  );

  private readonly routedMovieList$ = this.routerState.routerParams$.pipe(
    switchMap(({ type }) =>
      type === 'genre'
        ? this.genreMovieList$
        : type === 'category'
        ? this.initialCategoryMovieList$
        : this.searchMovieList$
    )
  );

  constructor(
    private discoverState: DiscoverState,
    private genreState: GenreState,
    private movieState: MovieState,
    private routerState: RouterState
  ) {
    super();
    this.connect(this.routedMovieList$);
    this.connect(
      this.paginate$.pipe(
        switchMapTo(this.routerCategory$),
        infiniteScrolled((cat, { page }) =>
          getMovieCategory(cat, page).pipe(
            map(({ results, total_pages }) => ({
              movies: results,
              totalPages: total_pages,
            }))
          )
        )
      ),
      (oldState, newSlice) => {
        if (newSlice.movies) {
          newSlice.movies = oldState.movies.concat(newSlice.movies);
        }
        return newSlice;
      }
    );
  }

  paginate() {
    this.paginate$.next();
  }
}
