import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { getDiscoverMovies } from '../../data-access/api/discover.resource';

export interface State {
  discoveredMovies: Record<string, MovieModel[]>;
  discoveredMoviesContext: boolean;
}

interface Actions {
  fetchDiscoverMovies: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiscoverState extends RxState<State> {
  private actions = getActions<Actions>({
    fetchDiscoverMovies: (e: string | number) => e + '',
  });

  readonly fetchDiscoverMovies = this.actions.fetchDiscoverMovies;

  constructor() {
    super();

    this.set({
      discoveredMovies: {},
    });

    this.connect(
      this.actions.fetchDiscoverMovies$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          (genre) => 'genre' + '-' + genre,
          (genre) =>
            getDiscoverMovies(genre).pipe(
              map(
                ({ results }) =>
                  ({ discoveredMovies: { [genre]: results } } as State)
              ),
              withLoadingEmission('genreMoviesContext')
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.discoveredMovies = patch(
          oldState.discoveredMovies,
          resultState.discoveredMovies
        );
        return resultState;
      }
    );
  }
}
