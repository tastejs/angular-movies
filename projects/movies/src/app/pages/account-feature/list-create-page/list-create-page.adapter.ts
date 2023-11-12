import {inject, Injectable} from '@angular/core';
import {patch} from '@rx-angular/cdk/transformations';
import {rxState} from '@rx-angular/state';
import {map, startWith, withLatestFrom} from 'rxjs';

import {TMDBListCreateUpdateParams} from '../../../data-access/api/model/list.model';
import {ListDetailAdapter} from '../list-detail-page/list-detail-page.adapter';
import {rxActions} from '@rx-angular/state/actions';
import {ListState} from '../../../state/list.state';
import {rxEffects} from "@rx-angular/state/effects";

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
export class ListCreatePageAdapter {
  private readonly listState = inject(ListState);

  private readonly state = rxState<{
    mode: FormMode;
    request: TMDBListCreateUpdateParams;
  }>(({connect}) => {

    connect('request', this.ui.update$, (state, update) => {
      if (update['private']) {
        update['private'] = JSON.parse(update['private']);
      }

      return patch(state.request, update);
    });

    connect(
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
  });
  private readonly detailsAdapter = inject(ListDetailAdapter);
  readonly ui = rxActions<Actions>();

  readonly showHeader$ = this.state.select(
    map((state) => state.mode === FormMode.Create)
  );
  readonly name$ = this.state.select('request', 'name');
  readonly description$ = this.state.select('request', 'description');
  readonly valid$ = this.state.select(map((state) => !!state?.request?.name?.length));
  readonly private$ = this.state.select('request', 'private');

  private readonly submitEvent$ = this.ui.submit$.pipe(
    withLatestFrom(this.state.select())
  );

  constructor() {
    rxEffects(e => e.register(this.submitEvent$, ([, state]) => {
      if (state.mode === 'edit') {
        this.detailsAdapter.ui.listInfoUpdate(state.request);
      }

      if (state.mode === 'create') {
        this.listState.createList(this.state.get('request'));
      }
    }));
  }

  resetForm() {
    this.state.set({
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
