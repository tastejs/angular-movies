import { Injectable } from '@angular/core';
import { exhaustMap, map } from 'rxjs';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { GenreResource } from '../../data-access/api/genre.resource';

export interface State {
  genres: MovieGenreModel[];
  genreMovies: Record<string, MovieModel[]>;
  genreMoviesContext: boolean;
}

interface Actions {
  refreshGenres: void;
  fetchGenreMovies: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenreState extends RxState<State> {
  private actions = getActions<Actions>({ fetchGenreMovies: (e: string | number) => e + '' });

  readonly genresNames$ = this.select('genres');

  readonly refreshGenres = this.actions.refreshGenres;
  readonly fetchGenreMovies = this.actions.fetchGenreMovies;

  constructor(private genreResource: GenreResource) {
    super();

    this.set({
      genreMovies: {}
    });

    this.connect('genres', this.actions.refreshGenres$.pipe(
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      exhaustMap(() => this.genreResource.getGenres()))
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
          (genre) => this.genreResource.getMovieGenre(genre)
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
  }

  initialFetch = () => {
    // initially fetch genres
    this.refreshGenres();
  };

}
