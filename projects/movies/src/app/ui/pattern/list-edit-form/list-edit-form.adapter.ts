import { Injectable } from '@angular/core';
import { patch, RxState } from '@rx-angular/state';
import { filter, map, switchMap, withLatestFrom } from 'rxjs';

import { TMDBListCreateUpdateParams } from '../../../data-access/api/model/list.model';
import { ListDetailAdapter } from '../../../pages/account-feature/list-detail-page/list-detail-page.adapter';
import { getActions } from '../../../shared/rxa-custom/actions';
import { ListState } from '../../../shared/state/list.state';

interface Actions {
  submit: void;
  update: { [key: string]: string };
}

@Injectable({
  providedIn: 'root',
})
export class ListEditFormAdapter extends RxState<{
  mode: 'create' | 'edit';
  request: TMDBListCreateUpdateParams;
}> {
  readonly ui = getActions<Actions>();

  readonly name$ = this.select('request', 'name');
  readonly description$ = this.select('request', 'description');
  readonly valid$ = this.select(map((state) => !!state?.request?.name.length));
  readonly private$ = this.select('request', 'private');

  private readonly submitEvent$ = this.ui.submit$.pipe(
    withLatestFrom(this.select())
  );

  constructor(
    private state: ListState,
    private detailsAdapter: ListDetailAdapter
  ) {
    super();
    this.set({
      mode: 'edit',
      request: {
        name: '',
        description: '',
        iso_639_1: 'en',
        private: true,
      },
    });

    this.connect('request', this.ui.update$, (state, update) => {
      if (update['private']) {
        update['private'] = JSON.parse(update['private']);
      }

      return patch(state.request, update);
    });

    this.hold(
      this.select('mode').pipe(
        filter((mode) => mode === 'edit'),
        switchMap(() =>
          this.detailsAdapter.listDetails$.pipe(
            map((list) => ({
              name: list.name || '',
              description: list.description || '',
              iso_639_1: 'en',
              private: Boolean(list.private),
            }))
          )
        )
      ),
      (request) => {
        this.set({ request });
      }
    );

    this.hold(this.submitEvent$, ([_, state]) => {
      if (state.mode === 'edit') {
        this.detailsAdapter.ui.listInfoUpdate(state.request);
      }

      if (state.mode === 'create') {
        this.state.createList(this.get('request'));
      }
    });
  }
}
