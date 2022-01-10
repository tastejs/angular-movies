import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { filter, map, Observable, switchMap } from 'rxjs';
import { getAccountList } from '../../data-access/api/resources/account.resource';
import { TMDBAccountList } from '../../data-access/api/model/account-list.interface';
import { AuthState } from '../../data-access/auth/auth.state';
import { withLoadingEmission } from '../../shared/cdk/loading/withLoadingEmissions';
import { WithContext } from '../../shared/cdk/context/context.interface';
import { TMDBPaginateResult } from '../../data-access/api/paginate/paginate.interface';

export interface AccountListPageAdapterState {
  lists: WithContext<TMDBPaginateResult<TMDBAccountList>>;
}

@Injectable({
  providedIn: 'root',
})
export class AccountListPageAdapter extends RxState<AccountListPageAdapterState> {
  readonly list$: Observable<TMDBAccountList> = this.select('lists');

  constructor(auth: AuthState) {
    super();
    this.connect(
      'lists',
      (auth.accountId$ as Observable<string>).pipe(
        filter((v) => v !== null),
        switchMap((id) =>
          getAccountList(id).pipe(
            map((value) => ({ value })),
            withLoadingEmission()
          )
        )
      )
    );
  }
}
