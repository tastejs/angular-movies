import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { filter, map, Observable, switchMap } from 'rxjs';
import { TMDBAccountList } from '../../data-access/api/model/list.model';
import { getAccountList } from '../../data-access/api/resources/account.resource';
import { AuthState } from '../auth/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AccountState extends RxState<{ lists: TMDBAccountList[] }> {
  readonly accountLists$ = this.select('lists');

  constructor(auth: AuthState) {
    super();
    this.connect(
      'lists',
      (auth.accountId$ as Observable<string>).pipe(
        filter((v) => v !== null),
        switchMap((id) =>
          getAccountList(id).pipe(map(({ results }) => results))
        )
      )
    );
  }
}
