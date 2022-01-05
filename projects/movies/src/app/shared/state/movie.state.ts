import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { patch, RxState, toDictionary } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../cdk/loading/withLoadingEmissions';
import {
  getMovie,
  getMovieCategory,
} from '../../data-access/api/resources/movie.resource';
import { PaginatedResult } from './typings';
import { LoadingState } from '../cdk/loading/loading-state.interface';
import { AppInitializer } from '../rxa-custom/app-initializer';

export interface State
  extends LoadingState<'moviesLoading'>,
    LoadingState<'categoryMoviesLoading'> {
  movies: Record<string, TMDBMovieModel>;
  categoryMovies: Record<string, PaginatedResult<TMDBMovieModel>>;
}

interface Actions {
  fetchMovie: string;
  fetchCategoryMovies: { category: string };
}

@Injectable({
  providedIn: 'root',
})
export class MovieState extends RxState<State> implements AppInitializer {
  private actions = getActions<Actions>();

  fetchMovie = this.actions.fetchMovie;
  fetchCategoryMovies = this.actions.fetchCategoryMovies;

  constructor() {
    super();

    this.connect(
      this.actions.fetchMovie$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         * E.G.: URLs with the same params
         */
        optimizedFetch(
          (id) => id,
          (id) => {
            return getMovie(id).pipe(
              map((result) => ({ movies: toDictionary([result], 'id') })),
              withLoadingEmission('moviesLoading')
            );
          }
        )
      ),
      (oldState, newPartial) => {
        let resultState = patch(oldState, newPartial);
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
        map(({ category }) => ({
          category,
        })),
        optimizedFetch(
          ({ category }) => `category-${category}`,
          ({ category }) =>
            getMovieCategory(category).pipe(
              map((paginatedResult) => ({
                categoryMovies: { [category]: paginatedResult },
              })),
              withLoadingEmission('categoryMoviesLoading')
            )
        )
      ),
      (oldState, newPartial) => {
        let resultState = patch(oldState, newPartial);
        resultState.categoryMovies = patch(
          oldState?.categoryMovies,
          resultState.categoryMovies
        );
        return resultState;
      }
    );
  }

  // prefetch categories / movie
  initialize(options: { category: string } | { movieId: string }): void {
    if ('category' in options && options.category) {
      this.fetchCategoryMovies(options);
    }
    if ('movieId' in options && options.movieId) {
      this.fetchMovie(options.movieId);
    }
  }
}
