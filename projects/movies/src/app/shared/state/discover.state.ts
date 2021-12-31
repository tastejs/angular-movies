import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { getDiscoverMovies } from '../../data-access/api/discover.resource';

export interface State {
  genreMovies: Record<string, MovieModel[]>;
  genreMoviesContext: boolean;
}

interface Actions {
  fetchGenreMovies: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiscoverState extends RxState<State> {
  private actions = getActions<Actions>({
    fetchGenreMovies: (e: string | number) => e + '',
  });

  readonly fetchGenreMovies = this.actions.fetchGenreMovies;

  constructor() {
    super();

    this.set({
      genreMovies: {},
    });

    this.connect(
      this.actions.fetchGenreMovies$.pipe(
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
                  ({ genreMovies: { [genre]: results } } as State)
              ),
              withLoadingEmission('genreMoviesContext')
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.genreMovies = patch(
          oldState.genreMovies,
          resultState.genreMovies
        );
        return resultState;
      }
    );
  }
}
