import { RxState } from '@rx-angular/state';
import { patch, toDictionary } from '@rx-angular/cdk/transformations';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { filter, map } from 'rxjs';
import { optimizedFetch } from '../shared/cdk/optimized-fetch';
import { AppInitializer } from '../shared/cdk/app-initializer';
import { RxActionFactory } from '@rx-angular/state/actions';
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
export class MovieState extends RxState<MovieModel> implements AppInitializer {
  private readonly movieResource = inject(MovieResource);
  private readonly actionsF = new RxActionFactory<Actions>();
  private readonly actions = this.actionsF.create();

  fetchMovie = this.actions.fetchMovie;
  fetchCategoryMovies = this.actions.fetchCategoryMovies;

  categoryMoviesByIdCtx = (id: string) =>
    this.select(
      filter(({ categoryMovies }) => !!categoryMovies),
      map(({ categoryMovies: { value, loading } }) => ({
        loading,
        value: pluck(value, id),
      }))
    );

  movieByIdCtx = (id: string) =>
    this.select(
      map(({ movies: { value, loading } }) => ({
        loading,
        value: pluck(value, id),
      }))
    );

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.actionsF.destroy());

    this.connect(
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
        let resultState = patch(oldState?.movies || {}, newPartial);
        resultState.value = patch(
          oldState?.movies?.value || {},
          resultState?.value || {}
        );
        return resultState;
      }
    );

    this.connect(
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
        let resultState = patch(oldState?.categoryMovies, newPartial);
        // @ts-ignore
        // resultState?.value.results = resultState?.value?.results.map((m: TMDBMovieModel) => ({...m, poster_path: m.poster_path}) as TMDBMovieModel)
        resultState.value = patch(
          oldState?.categoryMovies?.value,
          resultState?.value
        );
        return resultState;
      }
    );
  }

  // prefetch categories / movie
  initialize(options: { category: string } | { movieId: string }): void {
    if ('category' in options && options.category) {
      this.fetchCategoryMovies(options.category);
    }
    if ('movieId' in options && options.movieId) {
      this.fetchMovie(options.movieId);
    }
  }
}
