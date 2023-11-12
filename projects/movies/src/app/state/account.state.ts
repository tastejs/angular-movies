import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {rxState} from '@rx-angular/state';
import { filter, map, switchMap } from 'rxjs';
import { TMDBAccountList } from '../data-access/api/model/list.model';
import { AccountResource } from '../data-access/api/resources/account.resource';
import { isPlatformBrowser } from '@angular/common';

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
  private readonly state = rxState<AccountStateModel>(({connect, set}) => {
    if (isPlatformBrowser(this.platformId)) {
      // set accountId if found in localStorage
      set({ accountId: window.localStorage.getItem('accountId') });
    }
    connect('lists', this.accountId$.pipe(
        // process only given accountId
        filter((accountId): accountId is string => accountId !== null),
        switchMap((id) => this.authResource.getAccountList(id).pipe(map(({ results }) => results)))
      )
    );
  });
  set = this.state.set;
  select = this.state.select;
  private readonly platformId = inject(PLATFORM_ID);

  readonly accountId$ = this.state.select('accountId');
  readonly loggedIn$ = this.state.select(map(({ accountId }) => accountId !== null));
  readonly accountLists$ = this.state.select('lists');
}
