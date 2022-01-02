import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { patch, RxState, toDictionary } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { MoviePersonModel } from '../../data-access/model/movie-person.model';
import { getPerson } from '../../data-access/api/person.resource';

export interface State {
  person: Record<string, MoviePersonModel>;
  personContext: boolean;
}

interface Actions {
  fetchPerson: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonState extends RxState<State> {
  private actions = getActions<Actions>();

  fetchPerson = this.actions.fetchPerson;

  constructor() {
    super();
    this.connect(this.actions.fetchPerson$.pipe(
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      optimizedFetch(
        (id) => id,
        (id) => {
          return getPerson(id)
            .pipe(
              map(result => ({ person: toDictionary([result], 'id') } as State)),
              withLoadingEmission('personContext', true, false)
            );
        }
      )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.person = patch(oldState?.person, resultState.person);
        return resultState;
      }
    );
  }

}
