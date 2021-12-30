import { combineLatest, concatMap, filter, map, Observable, Subject, switchMap, switchMapTo, withLatestFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { MovieModel } from '../../data-access/model/movie.model';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { RxState, selectSlice } from '@rx-angular/state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { RouterState } from '../../shared/state/router.state';
import { GenreState } from '../../shared/state/genre.state';
import { MovieState } from '../../shared/state/movie.state';
import { PaginationState } from '../../shared/utils/paginate/paginate-state.interface';
import { parseTitle } from '../../shared/utils/parse-movie-list-title';
import { DiscoverState } from '../../shared/state/discover.state';
import { getMoviesSearch } from '../../data-access/api/search.resource';
import { withLoadingEmission } from '../../shared/utils/withLoadingEmissions';
import { getMovieCategory } from '../../data-access/api/movie.resource';

type MovieListPageModel = PaginationState & {
  loading: boolean;
  movies: MovieModel[];
  title: string;
  type: string;
  activeCategory: string;
};

/*
  (options) => getMovieCategory(cat, options.activePage + 1).pipe(
    map(
      ({ results, total_pages }) =>
        ({
          movies: results,
          totalPages: total_pages
        } as Partial<MovieListPageModel>)
    )
  )
  */

type PaginationOptions = { page: number };

function infiniteScrolled<T, I>(fn: (param: I, paginationOptions: PaginationOptions) => Observable<Partial<T & {totalPages: number}>>) {
  let activePage = 1;
  return (o$: Observable<I>): Observable<Partial<T | PaginationState>> => o$.pipe(
    concatMap((trigger: I) => {
      return (fn(trigger, { page: ++activePage }) as Observable<PaginationState & T>).pipe(
        withLoadingEmission('loading', true, false),
        map(a => a)
      );
    })
  );
};

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

  private readonly initialCategoryMovieList$: Observable<MovieListPageModel> =
    this.movieState.select(
      selectSlice([
        'categoryMovies',
        'categoryMoviesContext',
        'categoryMoviesTotalPages'
      ]),
      withLatestFrom(this.routerCategory$),
      map(
        ([
           { categoryMovies, categoryMoviesContext, categoryMoviesTotalPages },
           listName
         ]) => {
          return {
            activePage: 1,
            totalPages: categoryMoviesTotalPages[listName],
            loading: categoryMoviesContext,
            title: parseTitle(listName),
            activeCategory: listName,
            type: 'category',
            movies: (categoryMovies && categoryMovies[listName]) || null
          };
        }
      )
    );

  _slice$ = combineLatest({
    genres: this.genreState.select('genres'),
    discoverSlice: this.discoverState.select(
      selectSlice(['genreMovies', 'genreMoviesContext'])
    )
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
        movies: (genreMovies && genreMovies[genreIdStr]) || null
      };
    })
  );

  private readonly searchMovieList$: Observable<MovieListPageModel> =
    this.routerSearch$.pipe(
      // cancel previous requests
      switchMap((query) =>
        getMoviesSearch(query).pipe(
          map(
            ({ results }) =>
              ({
                movies: results || null,
                title: parseTitle(query)
              } as MovieListPageModel)
          ),
          withLoadingEmission('loading', true, false)
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
        filter(() => {
          return this.get('activePage') < this.get('totalPages');
        }),
        withLatestFrom(this.routerCategory$),
        concatMap(([_, cat]) =>
          getMovieCategory(cat, this.get('activePage') + 1).pipe(
            map(
              ({ results, total_pages }) =>
                ({
                  movies: results,
                  totalPages: total_pages,
                  activePage: this.get('activePage') + 1
                } as Partial<MovieListPageModel>)
            ),
            withLoadingEmission('loading', true, false)
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
