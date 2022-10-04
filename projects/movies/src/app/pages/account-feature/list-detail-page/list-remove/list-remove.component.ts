import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { merge } from 'rxjs';
import { ListDetailAdapter } from '../list-detail-page.adapter';
import { describeRxActions } from '../../../../shared/rxa-custom/actions.definition';
import { describeRxEffects } from '../../../../shared/rxa-custom/effects.definition';

type Actions = {
  openDialog: void;
  closeDialog: void;
  confirm: void;
};
const { provide: provideRxActions, inject: injectRxActions } =
  describeRxActions<Actions>();

const { provide: provideRxEffects, inject: injectRxEffects } =
  describeRxEffects();

@Component({
  standalone: true,
  selector: 'app-list-remove',
  templateUrl: './list-remove.component.html',
  styleUrls: ['./list-remove.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideRxActions(), provideRxEffects()],
})
export class ListRemoveComponent implements AfterViewInit {
  @ViewChild('dialog', { static: true }) dialog!: ElementRef<{
    showModal: () => void;
    close: () => void;
  }>;

  readonly ui = injectRxActions();
  readonly ef = injectRxEffects();

  constructor(public adapter: ListDetailAdapter) {
    this.ef.register(this.ui.confirm$, this.adapter.ui.deleteList);
  }

  ngAfterViewInit(): void {
    this.ef.register(merge(this.ui.confirm$, this.ui.closeDialog$), () =>
      this.dialog.nativeElement.close()
    );
    this.ef.register(this.ui.openDialog$, () =>
      this.dialog.nativeElement.showModal()
    );
  }
}
