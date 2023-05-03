import { inject, Injectable } from '@angular/core';
import { patch } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { map, startWith, withLatestFrom } from 'rxjs';

import { TMDBListCreateUpdateParams } from '../../../data-access/api/model/list.model';
import { ListDetailAdapter } from '../list-detail-page/list-detail-page.adapter';
import { RxActionFactory } from '@rx-angular/state/actions';
import { ListState } from '../../../state/list.state';

interface Actions {
  submit: void;
  update: { [key: string]: string };
}

/**
 * **🚀 Perf Tip for FID:**
 * const enums will be treated as types and disappear after compile-step
 * from your bundle. Whereas regular enums will result in transpiled javascript
 * code remaining in your bundle, shipped to the user
 */
const enum FormMode {
  Create = 'create',
  Edit = 'edit',
}

@Injectable({
  providedIn: 'root',
})
export class ListCreatePageAdapter extends RxState<{
  mode: FormMode;
  request: TMDBListCreateUpdateParams;
}> {
  private readonly state = inject(ListState);
  private readonly detailsAdapter = inject(ListDetailAdapter);
  readonly ui = new RxActionFactory<Actions>().create();

  readonly showHeader$ = this.select(
    map((state) => state.mode === FormMode.Create)
  );
  readonly name$ = this.select('request', 'name');
  readonly description$ = this.select('request', 'description');
  readonly valid$ = this.select(map((state) => !!state?.request?.name?.length));
  readonly private$ = this.select('request', 'private');

  private readonly submitEvent$ = this.ui.submit$.pipe(
    withLatestFrom(this.select())
  );

  constructor() {
    super();

    this.connect('request', this.ui.update$, (state, update) => {
      if (update['private']) {
        update['private'] = JSON.parse(update['private']);
      }

      return patch(state.request, update);
    });

    this.connect(
      this.detailsAdapter.listDetails$.pipe(
        map((list) => ({
          request: {
            name: list.name || '',
            description: list.description || '',
            iso_639_1: 'en',
            private: Boolean(list.private),
          },
          mode: FormMode.Edit,
        })),
        startWith({
          request: {
            name: '',
            description: '',
            iso_639_1: 'en',
            private: true,
          },
          mode: FormMode.Create,
        })
      )
    );

    this.hold(this.submitEvent$, ([, state]) => {
      if (state.mode === 'edit') {
        this.detailsAdapter.ui.listInfoUpdate(state.request);
      }

      if (state.mode === 'create') {
        this.state.createList(this.get('request'));
      }
    });
  }

  resetForm() {
    this.set({
      mode: FormMode.Create,
      request: {
        name: '',
        description: '',
        iso_639_1: 'en',
        private: true,
      },
    });
  }
}
