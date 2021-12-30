import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, toDictionary } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { getMovie, getMovieCategory } from '../../data-access/api/movie.resource';

export interface State {
  movies: Record<string, MovieModel>;
  moviesContext: boolean;
  categoryMovies: Record<string, MovieModel[]>;
  categoryMoviesContext: boolean;
  categoryMoviesPaging: boolean;
  activeCategory: string;
  activePage: number;
  totalPages: number;
}

interface Actions {
  fetchMovie: string;
  fetchCategoryMovies: { category: string; page?: number };
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
    this.set({
      totalPages: 0,
      activeCategory: '',
      activePage: 0,
      categoryMoviesPaging: false,
    });
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
            return getMovie(id)
              .pipe(
                map((result) => ({ movies: toDictionary([result], 'id') } as State)),
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
    /*this.connect(
      this.actions.fetchCategoryMovies$.pipe(
        map(({ category, page }) => {
          const newState = {
            activeCategory: category,
            activePage: page == null ? 1 : page,
          };
          console.log(newState, 'newState');
          return newState;
        })
      )
    );*/
    this.hold(this.select(), console.log);
    this.connect(
      this.actions.fetchCategoryMovies$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        map(({ category, page }) => ({
          category,
          page: page || 1,
        })),
        optimizedFetch(
          ({ category, page }) => `category-${category}-${page}`,
          ({ category, page }) =>
            getMovieCategory(category, page).pipe(
              map(
                ({ results, total_pages }) =>
                  ({
                    categoryMovies: { [category]: results },
                    activeCategory: category,
                    totalPages: total_pages,
                    activePage: page,
                  } as State)
              ),
              withLoadingEmission(
                page === 1 ? 'categoryMoviesContext' : 'categoryMoviesPaging',
                true,
                false
              )
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        const { activePage, activeCategory, categoryMovies } = newPartial;
        if (activePage > 1) {
          return {
            ...patch(oldState, s),
            categoryMovies: {
              ...oldState.categoryMovies,
              [activeCategory]: [
                ...oldState.categoryMovies[activeCategory],
                ...categoryMovies[activeCategory],
              ],
            },
          };
        }
        let resultState = patch(oldState, s);
        resultState.categoryMovies = patch(
          oldState?.categoryMovies,
          resultState.categoryMovies
        );
        return resultState;
      }
    );
  }
}
