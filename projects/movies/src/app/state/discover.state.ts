import { rxState } from '@rx-angular/state';
import { patch } from '@rx-angular/cdk/transformations';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { optimizedFetch } from '../shared/cdk/optimized-fetch';
import { rxActions } from '@rx-angular/state/actions';
import { withLoadingEmission } from '../shared/cdk/loading/withLoadingEmissions';
import {
  DiscoverResource,
  TMDBDiscoverResponse,
} from '../data-access/api/resources/discover.resource';
import { AppInitializer } from '../shared/cdk/app-initializer';
import { WithContext } from '../shared/cdk/loading/context.interface';
import { pluck } from '../shared/cdk/get';

export interface State {
  genreMovies: WithContext<Record<string, TMDBDiscoverResponse>>;
  personMovies: WithContext<Record<string, TMDBDiscoverResponse>>;
}

interface Actions {
  fetchDiscoverGenreMovies: string;
  fetchDiscoverCastMovies: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiscoverState implements AppInitializer {
  private readonly actions = rxActions<Actions>(({ transforms }) =>
    transforms({
      fetchDiscoverGenreMovies: String,
      fetchDiscoverCastMovies: String,
    })
  );
  readonly fetchDiscoverGenreMovies = this.actions.fetchDiscoverGenreMovies;

  private readonly state = rxState<State>(({ connect }) => {
    connect(
      'genreMovies',
      this.actions.fetchDiscoverGenreMovies$.pipe(
        optimizedFetch(
          (genre: string) => genre,
          (with_genres: string) =>
            this.discoverResource
              .getDiscoverMovies({ with_genres, page: 1 })
              .pipe(
                map((resp) => ({ value: { [with_genres]: resp } })),
                withLoadingEmission()
              )
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.genreMovies, newPartial);
        resultState.value = patch(
          oldState?.genreMovies?.value,
          resultState.value
        );
        return resultState;
      }
    );

    connect(
      'personMovies',
      this.actions.fetchDiscoverCastMovies$.pipe(
        optimizedFetch(
          (person) => person,
          (with_cast: string) =>
            this.discoverResource
              .getDiscoverMovies({ with_cast, page: 1 })
              .pipe(
                map((resp) => ({ value: { [with_cast]: resp } })),
                withLoadingEmission()
              )
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.personMovies, newPartial);
        resultState.value = patch(
          oldState?.personMovies?.value,
          resultState.value
        );
        return resultState;
      }
    );
  });
  private readonly discoverResource = inject(DiscoverResource);

  readonly genreMoviesByIdSlice = (id: string) =>
    this.state.select(
      map(({ genreMovies: { value, loading } }) => ({
        loading,
        value: pluck(value, id),
      }))
    );

  initialize(category: unknown): void {
    this.fetchDiscoverGenreMovies(category as string);
  }
}
