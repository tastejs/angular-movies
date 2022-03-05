import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs';
import { W500H282 } from '../../../data-access/api/constants/image-sizes';

import { TMDBAccountList } from '../../../data-access/api/model/list.model';
import { AccountState } from '../../../shared/state/account.state';
import { ListState } from '../../../shared/state/list.state';
import { ImageTag } from '../../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../../shared/utils/image/image-tag.transform';

export type ListWithPoster = TMDBAccountList & ImageTag;

export interface AccountListPageAdapterState {
  lists: ListWithPoster[];
}

@Injectable({
  providedIn: 'root',
})
export class AccountListPageAdapter extends RxState<AccountListPageAdapterState> {
  constructor(accountState: AccountState, private list: ListState) {
    super();
    this.connect(
      'lists',
      accountState.accountLists$.pipe(
        map((lists) =>
          lists.map((l) =>
            addImageTag(l, {
              pathProp: 'backdrop_path',
              dims: W500H282,
              fallback: 'assets/images/nothing.svg',
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
