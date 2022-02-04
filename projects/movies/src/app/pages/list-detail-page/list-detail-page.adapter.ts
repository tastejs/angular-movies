import { Injectable } from '@angular/core';
import { RxState, select } from '@rx-angular/state';
import { from, map, of, startWith, switchMap, withLatestFrom } from 'rxjs';
import { TMDBListCreateUpdateParams } from '../../data-access/api/model/list.model';
import { getActions } from '../../shared/rxa-custom/actions';
import { ListState } from '../../shared/state/list.state';

import { RouterState } from '../../shared/state/router.state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';

const LIST_DETAILS_COMPONENTS = [
  () =>
    import('../../ui/pattern/list-items-edit/list-items-edit.component').then(
      (m) => {
        return m.ListItemsEditComponent;
      }
    ),
  () =>
    import('./list-delete/list-delete.component').then((m) => {
      return m.ListDeleteComponent;
    }),
];

@Injectable({
  providedIn: 'root',
})
export class ListDetailAdapter extends RxState<{
  id: string;
  activeTabIndex: number;
}> {
  readonly ui = getActions<{
    changeTab: number;
    listInfoUpdate: TMDBListCreateUpdateParams;
    deleteList: void;
  }>();

  readonly routerListId$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('list', 'detail')
  );

  private readonly listInfoUpdateEvent$ = this.ui.listInfoUpdate$.pipe(
    withLatestFrom(this.select('id'))
  );

  private readonly listDeleteEvent$ = this.ui.deleteList$.pipe(
    withLatestFrom(this.select('id'))
  );

  readonly listDetails$ = this.select('id').pipe(
    switchMap((id) => this.listState.select('lists', id))
  );

  readonly listName$ = this.listDetails$.pipe(
    select('name'),
    startWith('Loading...')
  );

  readonly activeTab$ = this.select('activeTabIndex');

  readonly formComponent$ = this.select('activeTabIndex').pipe(
    switchMap((idx) =>
      from(idx > 0 ? LIST_DETAILS_COMPONENTS[idx - 1]() : of(null)).pipe(
        map((component) => ({
          component,
          idx,
        }))
      )
    )
  );

  constructor(private listState: ListState, private routerState: RouterState) {
    super();

    this.set({ activeTabIndex: 0 });

    this.connect('id', this.routerListId$);
    this.connect('activeTabIndex', this.ui.changeTab$);

    this.hold(this.routerListId$, this.listState.fetchList);
    this.hold(this.listInfoUpdateEvent$, ([info, id]) =>
      this.listState.updateList({ ...info, id: +id })
    );

    this.hold(this.listDeleteEvent$, ([_, id]) =>
      this.listState.deleteList(id)
    );
  }
}
