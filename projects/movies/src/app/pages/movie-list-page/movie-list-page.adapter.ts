import {
  combineLatest,
  map,
  Observable,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { MovieModel } from '../../data-access/model/movie.model';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { RxState, selectSlice } from '@rx-angular/state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { RouterState } from '../../shared/state/router.state';
import { GenreState } from '../../shared/state/genre.state';
import { MovieState } from '../../shared/state/movie.state';
import { parseTitle } from '../../shared/utils/parse-movie-list-title';
import { DiscoverState } from '../../shared/state/discover.state';
import { getMoviesSearch } from '../../data-access/api/search.resource';
import { withLoadingEmission } from '../../shared/utils/withLoadingEmissions';

type MovieListPageModel = {
  loading: boolean;
  paging?: boolean;
  movies: MovieModel[];
  title: string;
  type: string;
};

@Injectable({
  providedIn: 'root',
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {

  routerSearch$ = this.routerState.select(getIdentifierOfTypeAndLayout('search', 'list'));
  routerGenre$ = this.routerState.select(getIdentifierOfTypeAndLayout('genre', 'list'));
  routerCategory$ = this.routerState.select(getIdentifierOfTypeAndLayout('category', 'list'));

  private readonly categoryMovieList$: Observable<MovieListPageModel> =
    this.movieState.select(
      selectSlice([
        'categoryMovies',
        'categoryMoviesContext',
        'categoryMoviesPaging',
      ]),
      withLatestFrom(this.routerCategory$),
      map(
        ([
          { categoryMovies, categoryMoviesContext, categoryMoviesPaging },
          listName,
        ]) => {
          return {
            loading: categoryMoviesContext,
            paging: categoryMoviesPaging,
            title: parseTitle(listName),
            type: 'category',
            movies: (categoryMovies && categoryMovies[listName]) || null,
          };
        }
      )
    );

  _slice$ = combineLatest({
      genres: this.genreState.select('genres'),
      discoverSlice: this.discoverState.select(selectSlice(['genreMovies', 'genreMoviesContext']))
    }
  ).pipe(
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

  private readonly searchMovieList$: Observable<MovieListPageModel> = this.routerSearch$.pipe(
    // cancel previous requests
    switchMap((query) => getMoviesSearch(query)
      .pipe(
        map(({ results }) => ({ movies: results || null, title: parseTitle(query) }) as MovieListPageModel),
        withLoadingEmission('loading', true, false)
      )
    )
  );

  private readonly routedMovieList$ = this.routerState.routerParams$.pipe(
    switchMap(({ type }) => type === 'genre' ? this.genreMovieList$ : type === 'category' ? this.categoryMovieList$ : this.searchMovieList$)
  );

  constructor(
    private discoverState: DiscoverState,
    private genreState: GenreState,
    private movieState: MovieState,
    private routerState: RouterState
  ) {
    super();
    this.set({ paging: false });
    this.connect(this.routedMovieList$);
  }

  paginate() {
    this.movieState.fetchCategoryMovies({
      category: this.movieState.get('activeCategory'),
      page: this.movieState.get('activePage') + 1,
    });
  }
}
