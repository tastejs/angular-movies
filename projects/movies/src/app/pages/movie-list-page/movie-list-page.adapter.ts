import { MovieModel } from '../../data-access/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { StateService } from '../../shared/state/state.service';
import { RouterStateService } from '../../shared/state/router-state.service';
import { map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { parseTitle } from '../../shared/utils/parse-movie-list-title';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';

type MovieListPageModel = {
  loading: boolean;
  movies: MovieModel[];
  title: string;
  type: string;
};

@Injectable({
  providedIn: 'root'
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {

  routerSearch$ = this.routerState.select(getIdentifierOfTypeAndLayout('search', 'list'));
  routerGenre$ = this.routerState.select(getIdentifierOfTypeAndLayout('genre', 'list'));
  routerCategory$ = this.routerState.select(getIdentifierOfTypeAndLayout('category', 'list'));

  private readonly categoryMovieList$: Observable<MovieListPageModel> = this.globalState.select(
    selectSlice(['categoryMovies', 'categoryMoviesContext']),
    withLatestFrom(this.routerCategory$),
    map(([{ categoryMovies, categoryMoviesContext }, listName]) => {
        return ({
          loading: categoryMoviesContext,
          title: parseTitle(listName),
          type: 'category',
          movies: categoryMovies && categoryMovies[listName] || null
        });
      }
    )
  );

  private readonly genreMovieList$ = this.globalState.select(
    selectSlice(['genres', 'genreMovies', 'genreMoviesContext']),
    withLatestFrom(this.routerGenre$),
    map(([{ genres, genreMovies, genreMoviesContext }, genreParam]) => {
      const genreIdStr = genreParam as unknown as string;
      const genreId = parseInt(genreIdStr, 10);
      const genreName = genres.find((g: MovieGenreModel) => g.id === genreId)?.name || 'unknown genre';
      return {
        loading: genreMoviesContext,
        title: parseTitle(genreName),
        type: 'genre',
        movies: genreMovies && genreMovies[genreIdStr] || null
      };
    })
  );

  private readonly searchMovieList$: Observable<MovieListPageModel> = this.globalState.select(
    selectSlice(['search', 'searchContext']),
    withLatestFrom(this.routerSearch$),
    map(([{ search, searchContext }, listName]) => {
        return ({
          loading: searchContext,
          title: parseTitle(listName),
          type: 'search',
          movies: search && search || null
        });
      }
    )
  );

  private readonly routedMovieList$ = this.routerState.routerParams$.pipe(
    switchMap(({ type }) => type === 'genre' ? this.genreMovieList$ : type === 'category' ? this.categoryMovieList$ : this.searchMovieList$)
  );

  constructor(private globalState: StateService, private routerState: RouterStateService) {
    super();
    this.connect(this.routedMovieList$);

  }

}
