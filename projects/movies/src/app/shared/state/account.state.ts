import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { filter, map, Observable, switchMap } from 'rxjs';
import { TMDBAccountList } from '../../data-access/api/model/list.model';
import { AuthState } from '../auth/auth.state';
import { AccountResource } from '../../data-access/api/resources/account.resource';

@Injectable({
  providedIn: 'root',
})
export class AccountState extends RxState<{ lists: TMDBAccountList[] }> {
  readonly accountLists$ = this.select('lists');

  constructor(auth: AuthState, authResource: AccountResource) {
    super();
    this.connect(
      'lists',
      (auth.accountId$ as Observable<string>).pipe(
        filter((v) => v !== null),
        switchMap((id) =>
          authResource.getAccountList(id).pipe(map(({ results }) => results))
        )
      )
    );
  }
}
