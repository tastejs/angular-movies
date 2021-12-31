import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, toDictionary } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import {
  getMovie,
  getMovieCategory,
} from '../../data-access/api/movie.resource';
import { PaginationState } from '../utils/infinite-scroll/paginate-state.interface';

export interface State extends PaginationState {
  movies: Record<string, MovieModel>;
  moviesContext: boolean;
  categoryMovies: Record<string, MovieModel[]>;
  categoryMoviesTotalPages: Record<string, number>;
  categoryMoviesContext: boolean;
}

interface Actions {
  fetchMovie: string;
  fetchCategoryMovies: { category: string };
}

@Injectable({
  providedIn: 'root',
})
export class MovieState extends RxState<State> {
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
              map(
                (result) => ({ movies: toDictionary([result], 'id') } as State)
              ),
              withLoadingEmission('moviesContext')
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
        map(({ category }) => ({
          category,
        })),
        optimizedFetch(
          ({ category }) => `category-${category}`,
          ({ category }) =>
            getMovieCategory(category).pipe(
              map(
                ({ results, total_pages }) =>
                  ({
                    categoryMovies: { [category]: results },
                    categoryMoviesTotalPages: { [category]: total_pages },
                  } as State)
              ),
              withLoadingEmission('categoryMoviesContext')
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.categoryMovies = patch(
          oldState?.categoryMovies,
          resultState.categoryMovies
        );
        resultState.categoryMoviesTotalPages = patch(
          oldState?.categoryMoviesTotalPages,
          resultState.categoryMoviesTotalPages
        );
        return resultState;
      }
    );
  }
}
