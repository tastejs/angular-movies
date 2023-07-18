import {RxState} from '@rx-angular/state';
import {patch, toDictionary} from '@rx-angular/cdk/transformations';
import {DestroyRef, inject, Injectable} from '@angular/core';
import {map} from 'rxjs';
import {optimizedFetch} from '../shared/cdk/optimized-fetch';
import {RxActionFactory} from '@rx-angular/state/actions';
import {withLoadingEmission} from '../shared/cdk/loading/withLoadingEmissions';
import {PersonResource, PersonResponse,} from '../data-access/api/resources/person.resource';
import {AppInitializer} from '../shared/cdk/app-initializer';
import {WithContext} from '../shared/cdk/loading/context.interface';
import {pluck} from '../shared/cdk/get';
import {TMDBSortOptions} from '../data-access/api/sort/sort.interface';

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
  private readonly actionsF = new RxActionFactory<Actions>();

  private personResource = inject(PersonResource);
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

  constructor() {
    inject(DestroyRef).onDestroy(() => this.actionsF.destroy());
    super();
    this.connect(
      'person',
      this.actions.fetchPerson$.pipe(
        optimizedFetch(
          (id) => id,
          (id) => {
            return this.personResource.getPerson(id).pipe(
              map((result) => ({ value: toDictionary([result], 'id') })),
              withLoadingEmission()
            );
          }
        )
      ),
      (oldState, newPartial) => {
        const resultState = patch(oldState?.person, newPartial);
        resultState.value = patch(oldState?.person?.value, resultState.value);
        return resultState;
      }
    );
  }

  initialize(identifier: unknown): void {
    this.fetchPerson(identifier as string);
  }
}
