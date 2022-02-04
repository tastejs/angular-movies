import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { RxState, toggle } from '@rx-angular/state';
import { LetModule } from '@rx-angular/template';
import { merge } from 'rxjs';
import { getActions } from '../../../shared/rxa-custom/actions';
import { ListDetailAdapter } from '../list-detail-page.adapter';

@Component({
  selector: 'ct-list-delete',
  templateUrl: './list-delete.component.html',
  styleUrls: ['./list-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListDeleteComponent extends RxState<{
  showModal: boolean;
}> {
  readonly ui = getActions<{
    toggleModal: void;
    confirm: void;
  }>();

  readonly showModal$ = this.select('showModal');
  constructor(public adapter: ListDetailAdapter) {
    super();

    this.connect(merge(this.ui.toggleModal$, this.ui.confirm$), (state) =>
      toggle(state, 'showModal')
    );

    this.hold(this.ui.confirm$, this.adapter.ui.deleteList);
  }
}

@NgModule({
  imports: [LetModule],
  declarations: [ListDeleteComponent],
  exports: [ListDeleteComponent],
})
export class ListDeleteComponentModule {}
