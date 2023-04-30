import { inject, Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { filter, map, Observable, switchMap } from 'rxjs';
import { TMDBAccountList } from '../data-access/api/model/list.model';
import { AccountResource } from '../data-access/api/resources/account.resource';
import { lazyInject } from '../shared/lazy-inject';

const LazyAuthState = () => import('../state/auth.state').then(x => x.AuthState);

@Injectable({
  providedIn: 'root',
})
export class AccountState extends RxState<{ lists: TMDBAccountList[] }> {
  readonly accountLists$ = this.select('lists');

  constructor() {
    super();
    const authResource = inject(AccountResource);
    const auth$ = lazyInject(LazyAuthState);
    this.connect(
      'lists',
      (auth$.pipe(switchMap(state => state.accountId$)) as Observable<string>).pipe(
        filter((v) => v !== null),
        switchMap((id) =>
          authResource.getAccountList(id).pipe(map(({results}) => results))
        )
      )
    );
  }
}
