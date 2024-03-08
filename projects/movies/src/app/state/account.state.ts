import { afterNextRender, inject, Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { filter, map, switchMap } from 'rxjs';
import { TMDBAccountList } from '../data-access/api/model/list.model';
import { AccountResource } from '../data-access/api/resources/account.resource';

export interface AccountStateModel {
  accountId: string | null;
  lists: TMDBAccountList[];
}

@Injectable({
  providedIn: 'root',
})
export class AccountState {
  // if account id changes update lists in state
  private readonly authResource = inject(AccountResource);
  private readonly state = rxState<AccountStateModel>(
    ({ connect, set, select }) => {
      afterNextRender(() => {
        // set accountId if found in localStorage
        set({ accountId: window.localStorage.getItem('accountId') });
      });
      connect(
        'lists',
        select('accountId').pipe(
          // process only given accountId
          filter((accountId): accountId is string => accountId !== null),
          switchMap((id) =>
            this.authResource
              .getAccountList(id)
              .pipe(map(({ results }) => results))
          )
        )
      );
    }
  );
  set = this.state.set;
  select = this.state.select;

  readonly loggedIn$ = this.state.select(
    map(({ accountId }) => accountId !== null)
  );
  readonly accountLists$ = this.state.select('lists');
}
