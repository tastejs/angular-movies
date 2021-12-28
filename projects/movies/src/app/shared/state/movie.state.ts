import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, toDictionary } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { MovieResource } from '../../data-access/api/movie.resource';

export interface State {
  movies: Record<string, MovieModel>;
  moviesContext: boolean;
  categoryMovies: Record<string, MovieModel[]>;
  categoryMoviesContext: boolean;
}

interface Actions {
  fetchMovie: string;
  fetchCategoryMovies: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieState extends RxState<State> {
  private actions = getActions<Actions>();

  fetchMovie = this.actions.fetchMovie;
  fetchCategoryMovies = this.actions.fetchCategoryMovies;

  constructor(private movieResource: MovieResource) {
    super();
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
          return this.movieResource.getMovie(id)
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

    this.connect(
      this.actions.fetchCategoryMovies$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          (category) => 'category' + '-' + category,
          (category) => this.movieResource.getMovieCategory(category)
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

  }

}
