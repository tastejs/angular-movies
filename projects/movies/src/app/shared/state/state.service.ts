import { Injectable } from '@angular/core';
import { exhaustMap, map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, selectSlice } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { parseTitle } from '../utils/parse-movie-list-title';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { RouterStateService } from './router-state.service';


export interface State {
  genres: MovieGenreModel[];
  genreMovies: Record<string, MovieModel[]>;
  genreMoviesContext: boolean;
  categoryMovies: Record<string, MovieModel[]>;
  categoryMoviesContext: boolean;
  search: MovieModel[];
  searchContext: boolean;
}

export interface MovieList {
  loading: boolean;
  title: string;
  type: string;
  movies: MovieModel[];
}

interface Actions {
  refreshGenres: void;
  fetchCategoryMovies: string;
  fetchGenreMovies: string;
  fetchSearchMovies: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService extends RxState<State> {
  private actions = getActions<Actions>({ fetchGenreMovies: (e: string | number) => e + '' });

  readonly genresNames$ = this.select('genres');
  readonly genreMovieList$ = this.select(
    selectSlice(['genres', 'genreMovies', 'genreMoviesContext']),
    withLatestFrom(this.routerState.routerGenre$),
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

  readonly categoryMovieList$: Observable<MovieList> = this.select(
    selectSlice(['categoryMovies', 'categoryMoviesContext']),
    withLatestFrom(this.routerState.routerCategory$),
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

  searchMovieList$: Observable<MovieList> = this.select(
    selectSlice(['search', 'searchContext']),
    withLatestFrom(this.routerState.routerSearch$),
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

  routedMovieList$ = this.routerState.routerParams$.pipe(
    switchMap(({ type }) => type === 'genre' ? this.genreMovieList$ : type === 'category' ? this.categoryMovieList$ : this.searchMovieList$)
  );

  constructor(private tmdb2Service: Tmdb2Service, private routerState: RouterStateService) {
    super();
    this.set({
      categoryMovies: {},
      genreMovies: {}
    })
  }

  /**
   * @TODO Add comment regards chunking
   */
  init = () => setTimeout(() => {
    this.connect('genres', this.actions.refreshGenres$.pipe(
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      exhaustMap(() => this.tmdb2Service.getGenres()))
    );

    this.connect(
      this.actions.fetchCategoryMovies$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          (category) => 'category' + '-' + category,
          (category) => this.tmdb2Service.getMovieCategory(category)
            .pipe(
              map(({ results }) => ({ categoryMovies: { [category]: results } } as State)),
              withLoadingEmission('categoryMoviesContext', true, false)
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.categoryMovies = patch(oldState?.categoryMovies, resultState.categoryMovies);
        return resultState;
      }
    );

    this.connect(
      this.actions.fetchGenreMovies$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          (genre) => 'genre' + '-' + genre,
          (genre) => this.tmdb2Service.getMovieGenre(genre)
            .pipe(
              map(({ results }) => ({ genreMovies: { [genre]: results } } as State)),
              withLoadingEmission('genreMoviesContext', true, false)
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.genreMovies = patch(oldState.genreMovies, resultState.genreMovies);
        return resultState;
      }
    );
    this.connect(
      this.actions.fetchSearchMovies$.pipe(
        switchMap((query) => this.tmdb2Service.getMovies(query)
          .pipe(
            map(({ results }) => ({ search: results } as State)),
            withLoadingEmission('searchContext', true, false)
          )
        )
      )
    );

    // initially fetch genres
    this.refreshGenres();
  });

  refreshGenres = this.actions.refreshGenres;

  fetchCategoryMovies = this.actions.fetchCategoryMovies;

  fetchGenreMovies = this.actions.fetchGenreMovies;

  fetchSearchMovies = this.actions.fetchSearchMovies;

}
