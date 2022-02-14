import { Injectable } from '@angular/core';
import { RxState, select } from '@rx-angular/state';
import { map, startWith, switchMap, withLatestFrom } from 'rxjs';
import { TMDBListCreateUpdateParams } from '../../../data-access/api/model/list.model';
import { getActions } from '../../../shared/rxa-custom/actions';
import { ListState } from '../../../shared/state/list.state';

import { RouterState } from '../../../shared/state/router.state';

@Injectable({
  providedIn: 'root',
})
export class ListDetailAdapter extends RxState<{
  id: string;
}> {
  readonly ui = getActions<{
    listInfoUpdate: TMDBListCreateUpdateParams;
    deleteList: void;
  }>();

  readonly routerListId$ = this.routerState.select(map((state) => state?.type));

  private readonly listInfoUpdateEvent$ = this.ui.listInfoUpdate$.pipe(
    withLatestFrom(this.select('id'))
  );

  private readonly listDeleteEvent$ = this.ui.deleteList$.pipe(
    withLatestFrom(this.select('id'))
  );

  readonly listDetails$ = this.select('id').pipe(
    switchMap((id) => this.listState.select('lists', id))
  );

  readonly movies$ = this.listDetails$.pipe(select('results'));

  readonly listName$ = this.listDetails$.pipe(
    select('name'),
    startWith('Loading...')
  );

  constructor(private listState: ListState, private routerState: RouterState) {
    super();

    this.connect('id', this.routerListId$);

    this.hold(this.routerListId$, this.listState.fetchList);
    this.hold(this.listInfoUpdateEvent$, ([info, id]) =>
      this.listState.updateList({ ...info, id: +id })
    );

    this.hold(this.listDeleteEvent$, ([_, id]) =>
      this.listState.deleteList(id)
    );
  }
}
