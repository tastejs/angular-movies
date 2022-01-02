import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { patch, RxState, toDictionary } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../cdk/loading/withLoadingEmissions';
import { TMDBMoviePersonModel } from '../../data-access/api/model/movie-person.model';
import { getPerson } from '../../data-access/api/resources/person.resource';
import { LoadingState } from '../cdk/loading/loading-state.interface';

export interface State extends LoadingState<'personLoading'> {
  person: Record<string, TMDBMoviePersonModel>;
}

interface Actions {
  fetchPerson: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonState extends RxState<State> {
  private actions = getActions<Actions>();

  fetchPerson = this.actions.fetchPerson;

  constructor() {
    super();
    this.connect(
      this.actions.fetchPerson$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         * E.G.: URLs with the same params
         */
        optimizedFetch(
          (id) => id,
          (id) => {
            return getPerson(id).pipe(
              map((result) => ({ person: toDictionary([result], 'id') })),
              withLoadingEmission('personContext')
            );
          }
        )
      ),
      (oldState, newPartial) => {
        let resultState = patch(oldState, newPartial);
        resultState.person = patch(oldState?.person, resultState.person);
        return resultState;
      }
    );
  }
}
