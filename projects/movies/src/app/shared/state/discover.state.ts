import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { patch, RxState } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { LoadingState, withLoadingEmission } from '../utils/withLoadingEmissions';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import { PaginatedResult } from './typings';

export interface State extends LoadingState<'discoveredMoviesLoading'> {
  discoveredMovies: Record<string, PaginatedResult<TMDBMovieModel>>;
}

interface Actions {
  fetchDiscoverMovies: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiscoverState extends RxState<State> {
  private actions = getActions<Actions>({
    fetchDiscoverMovies: (e: string | number) => e + ''
  });

  readonly fetchDiscoverMovies = this.actions.fetchDiscoverMovies;

  constructor() {
    super();

    this.set({
      discoveredMovies: {}
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
                (resp) =>
                  ({ discoveredMovies: { [genre]: resp } })
              ),
              withLoadingEmission('discoveredMoviesLoading')
            )
        )
      ),
      (oldState, newPartial) => {
        let resultState = patch(oldState, newPartial);
        resultState.discoveredMovies = patch(
          oldState.discoveredMovies,
          resultState.discoveredMovies
        );
        return resultState;
      }
    );
  }
}
