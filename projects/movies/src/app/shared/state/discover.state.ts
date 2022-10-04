import { RxState } from '@rx-angular/state';
import { patch } from '@rx-angular/cdk/transformations';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { optimizedFetch } from '../utils/optimized-fetch';
import { RxActionFactory } from '@rx-angular/state/actions';
import { withLoadingEmission } from '../cdk/loading/withLoadingEmissions';
import {
  DiscoverResource,
  TMDBDiscoverResponse,
} from '../../data-access/api/resources/discover.resource';
import { AppInitializer } from '../rxa-custom/app-initializer';
import { WithContext } from '../cdk/context/context.interface';
import { pluck } from '../rxa-custom/get';

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
export class DiscoverState extends RxState<State> implements AppInitializer {
  private actions = this.actionsF.create({
    fetchDiscoverGenreMovies: String,
    fetchDiscoverCastMovies: String,
  });

  readonly fetchDiscoverGenreMovies = this.actions.fetchDiscoverGenreMovies;

  readonly genreMoviesByIdSlice = (id: string) =>
    this.select(
      map(({ genreMovies: { value, loading } }) => ({
        loading,
        value: pluck(value, id),
      }))
    );

  constructor(
    private actionsF: RxActionFactory<Actions>,
    private discoverResource: DiscoverResource
  ) {
    super();

    this.connect(
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
        let resultState = patch(oldState?.genreMovies, newPartial);
        resultState.value = patch(
          oldState?.genreMovies?.value,
          resultState.value
        );
        return resultState;
      }
    );

    this.connect(
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
        let resultState = patch(oldState?.personMovies, newPartial);
        resultState.value = patch(
          oldState?.personMovies?.value,
          resultState.value
        );
        return resultState;
      }
    );
  }

  initialize(category: string): void {
    this.fetchDiscoverGenreMovies(category);
  }
}
