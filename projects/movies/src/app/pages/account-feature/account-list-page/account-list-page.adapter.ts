import { inject, Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs';
import { W500H282 } from '../../../data-access/images/image-sizes';

import { TMDBAccountList } from '../../../data-access/api/model/list.model';
import { AccountState } from '../../../state/account.state';
import { ListState } from '../../../state/list.state';
import { ImageTag } from '../../../shared/cdk/image/image-tag.interface';
import { addImageTag } from '../../../shared/cdk/image/image-tag.transform';
import { MY_LIST_FALLBACK } from '../../../constants';

export type ListWithPoster = TMDBAccountList & ImageTag;

export interface AccountListPageAdapterState {
  lists: ListWithPoster[];
}

@Injectable({
  providedIn: 'root',
})
export class AccountListPageAdapter extends RxState<AccountListPageAdapterState> {
  private readonly list = inject(ListState);

  constructor() {
    super();
    const accountState = inject(AccountState);
    this.connect(
      'lists',
      accountState.accountLists$.pipe(
        map((lists) =>
          lists.map((l) =>
            addImageTag(l, {
              pathProp: 'backdrop_path',
              dims: W500H282,
              fallback: MY_LIST_FALLBACK,
            })
          )
        )
      )
    );

    this.connect('lists', this.list.deleteListSignal$, (state, id) =>
      state.lists?.filter((l) => l.id !== +id)
    );
  }
}
