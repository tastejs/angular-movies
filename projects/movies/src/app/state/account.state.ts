import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RxState } from '@rx-angular/state';
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
export class AccountState extends RxState<AccountStateModel> {
  private readonly platformId = inject(PLATFORM_ID);

  readonly accountId$ = this.select('accountId');
  readonly loggedIn$ = this.select(map(({ accountId }) => accountId !== null));
  readonly accountLists$ = this.select('lists');

  constructor() {
    super();
    const authResource = inject(AccountResource);

    if (isPlatformBrowser(this.platformId)) {
      // set accountId if found in localStorage
      this.set({ accountId: window.localStorage.getItem('accountId') });
    }

    this.connect(
      'lists',
      this.accountId$.pipe(
        filter((accountId): accountId is string => accountId !== null),
        switchMap((id) =>
          authResource.getAccountList(id).pipe(map(({ results }) => results))
        )
      )
    );
  }
}
