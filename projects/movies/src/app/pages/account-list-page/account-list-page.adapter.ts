import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { filter, map, Observable, switchMap } from 'rxjs';
import { getAccountList } from '../../data-access/api/resources/account.resource';
import { TMDBAccountList } from '../../data-access/api/model/account-list.interface';
import { AuthStateService } from '../../data-access/auth/auth.state';
import { withLoadingEmission } from '../../shared/cdk/loading/withLoadingEmissions';

export interface AccountListPageAdapterState {
  loading: boolean;
  lists: TMDBAccountList[];
}

@Injectable({
  providedIn: 'root',
})
export class AccountListPageAdapter extends RxState<AccountListPageAdapterState> {
  readonly list$: Observable<TMDBAccountList> = this.select('lists');

  constructor(auth: AuthStateService) {
    super();
    this.connect(
      'lists',
      (auth.accountId$ as Observable<string>).pipe(
        filter((v) => v !== null),
        switchMap((id) => getAccountList(id)),
        withLoadingEmission(),
        map(({ results }) => results)
      )
    );
  }
}
