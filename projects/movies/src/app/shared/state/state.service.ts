import { Injectable } from '@angular/core';
import { exhaustMap, map, switchMap } from 'rxjs';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, toDictionary } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { MoviePersonModel } from '../../data-access/model/movie-person.model';

export interface State {
  genres: MovieGenreModel[];
  genreMovies: Record<string, MovieModel[]>;
  genreMoviesContext: boolean;
  person: Record<string, MoviePersonModel>;
  personContext: boolean;
  categoryMovies: Record<string, MovieModel[]>;
  categoryMoviesContext: boolean;
  search: MovieModel[];
  searchContext: boolean;
  movies: Record<string, MovieModel>;
  moviesContext: boolean;
}

interface Actions {
  fetchPerson: string;
  fetchMovie: string;
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

  constructor(private tmdb2Service: Tmdb2Service) {
    super();

    this.set({
      categoryMovies: {},
      genreMovies: {}
    });
  }

  /**
   * @TODO Add comment regards chunking
   */
  init = () => setTimeout(() => {
    this.connect(this.actions.fetchPerson$.pipe(
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      optimizedFetch(
        (id) => id,
        (id) => {
          return this.tmdb2Service.getPerson(id)
            .pipe(
              map(result => ({ person: toDictionary([result], 'id') } as State)),
              withLoadingEmission('personContext', true, false)
            );
        }
      )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.person = patch(oldState.person, resultState.person);
        return resultState;
      }
    );

    this.connect(this.actions.fetchMovie$.pipe(
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      optimizedFetch(
        (id) => id,
        (id) => {
          return this.tmdb2Service.getMovie(id)
            .pipe(
              map(result => ({ movies: toDictionary([result], 'id') } as State)),
              withLoadingEmission('moviesContext', true, false)
            );
        }
      )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.movies = patch(oldState?.movies, resultState.movies);
        return resultState;
      }
    );
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

  fetchPerson = this.actions.fetchPerson;

  fetchMovie = this.actions.fetchMovie;

  refreshGenres = this.actions.refreshGenres;

  fetchCategoryMovies = this.actions.fetchCategoryMovies;

  fetchGenreMovies = this.actions.fetchGenreMovies;

  fetchSearchMovies = this.actions.fetchSearchMovies;

}
