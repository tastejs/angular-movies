import { RxState } from '@rx-angular/state';
import { patch, toDictionary } from '@rx-angular/cdk/transformations';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { optimizedFetch } from '../utils/optimized-fetch';
import { RxActionFactory } from '../rxa-custom/actions';
import { withLoadingEmission } from '../cdk/loading/withLoadingEmissions';
import {
  getPerson,
  PersonResponse,
} from '../../data-access/api/resources/person.resource';
import { AppInitializer } from '../rxa-custom/app-initializer';
import { WithContext } from '../cdk/context/context.interface';
import { pluck } from '../rxa-custom/get';
import { TMDBSortOptions } from '../../data-access/api/sort/sort.interface';

export interface State {
  person: WithContext<Record<string, PersonResponse>>;
}

interface Actions {
  fetchPerson: string;
  sortMovies: TMDBSortOptions;
}

@Injectable({
  providedIn: 'root',
})
export class PersonState extends RxState<State> implements AppInitializer {
  private actions = this.actionsF.create();

  fetchPerson = this.actions.fetchPerson;
  sortMovies = this.actions.sortMovies;

  personByIdCtx = (id: string) =>
    this.select(
      map(({ person: { value, loading } }) => ({
        loading,
        value: pluck(value, id),
      }))
    );

  constructor(private actionsF: RxActionFactory<Actions>) {
    super();
    this.connect(
      'person',
      this.actions.fetchPerson$.pipe(
        optimizedFetch(
          (id) => id,
          (id) => {
            return getPerson(id).pipe(
              map((result) => ({ value: toDictionary([result], 'id') })),
              withLoadingEmission()
            );
          }
        )
      ),
      (oldState, newPartial) => {
        let resultState = patch(oldState?.person, newPartial);
        resultState.value = patch(oldState?.person?.value, resultState.value);
        return resultState;
      }
    );
  }

  initialize(identifier: string): void {
    this.fetchPerson(identifier);
  }
}
