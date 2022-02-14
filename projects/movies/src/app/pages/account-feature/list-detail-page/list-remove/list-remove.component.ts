import { Component } from '@angular/core';
import { toggle } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { getActions } from 'projects/movies/src/app/shared/rxa-custom/actions';
import { merge } from 'rxjs';
import { ListDetailAdapter } from '../list-detail-page.adapter';

@Component({
  selector: 'app-list-remove',
  templateUrl: './list-remove.component.html',
  styleUrls: ['./list-remove.component.scss'],
})
export class ListRemoveComponent extends RxState<{
  showModal: boolean;
}> {
  readonly showModal$ = this.select('showModal');

  readonly ui = getActions<{
    toggleModal: void;
    confirm: void;
  }>();

  constructor(public adapter: ListDetailAdapter) {
    super();

    this.connect(merge(this.ui.toggleModal$, this.ui.confirm$), (state) =>
      toggle(state, 'showModal')
    );

    this.hold(this.ui.confirm$, this.adapter.ui.deleteList);
  }
}
