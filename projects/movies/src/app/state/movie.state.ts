import { rxState } from '@rx-angular/state';
import { patch, toDictionary } from '@rx-angular/cdk/transformations';
import { inject, Injectable } from '@angular/core';
import { filter, map } from 'rxjs';
import { optimizedFetch } from '../shared/cdk/optimized-fetch';
import { AppInitializer } from '../shared/cdk/app-initializer';
import { rxActions } from '@rx-angular/state/actions';
import { withLoadingEmission } from '../shared/cdk/loading/withLoadingEmissions';
import {
  CategoryResponse,
  MovieResource,
  MovieResponse,
} from '../data-access/api/resources/movie.resource';
import { WithContext } from '../shared/cdk/loading/context.interface';
import { pluck } from '../shared/cdk/get';
import { TMDBMovieModel } from '../data-access/api/model/movie.model';
import { ImageTag } from '../shared/cdk/image/image-tag.interface';

export type Movie = TMDBMovieModel & ImageTag;

export interface MovieModel {
  movies: WithContext<Record<string, MovieResponse>>;
  categoryMovies: WithContext<Record<string, CategoryResponse>>;
}

interface Actions {
  fetchMovie: string;
  fetchCategoryMovies: string;
}

@Injectable({
  providedIn: 'root',
})
export class MovieState implements AppInitializer {
  private readonly movieResource = inject(MovieResource);
  private readonly actions = rxActions<Actions>();
  private readonly state = rxState<MovieModel>(({ connect }) => {
    connect(
      'movies',
      this.actions.fetchMovie$.pipe(
        optimizedFetch(
          (id) => id,
          (id) => {
            return this.movieResource.getMovie(id).pipe(
              map((result) => ({ value: toDictionary([result], 'id') })),
              withLoadingEmission()
            );
          }
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.movies || {}, newPartial);
        resultState.value = patch(
          oldState?.movies?.value || {},
          resultState?.value || {}
        );
        return resultState;
      }
    );

    connect(
      'categoryMovies',
      this.actions.fetchCategoryMovies$.pipe(
        map((category) => ({
          category,
        })),
        optimizedFetch(
          ({ category }) => category,
          ({ category }) =>
            this.movieResource.getMovieCategory(category).pipe(
              map((paginatedResult) => ({
                value: { [category]: paginatedResult },
              })),
              withLoadingEmission()
            )
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.categoryMovies, newPartial);
        resultState.value = patch(
          oldState?.categoryMovies?.value,
          resultState?.value
        );
        return resultState;
      }
    );
  });

  fetchMovie = this.actions.fetchMovie;
  fetchCategoryMovies = this.actions.fetchCategoryMovies;

  categoryMoviesByIdCtx = (id: string) =>
    this.state.select(
      filter(({ categoryMovies }) => !!categoryMovies),
      map(({ categoryMovies: { value, loading } }) => ({
        loading,
        value: pluck(value, id),
      }))
    );

  movieByIdCtx = (id: string) =>
    this.state.select(
      map(({ movies: { value, loading } }) => ({
        loading,
        value: pluck(value, id),
      }))
    );

  // prefetch categories / movie
  initialize(options: unknown): void {
    const opts = options as { category: string } | { movieId: string };
    if ('category' in opts && opts.category) {
      this.fetchCategoryMovies(opts.category);
    }
    if ('movieId' in opts && opts.movieId) {
      this.fetchMovie(opts.movieId);
    }
  }
}
