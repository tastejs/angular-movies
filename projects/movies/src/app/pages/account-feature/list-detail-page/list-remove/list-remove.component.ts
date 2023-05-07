import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { merge } from 'rxjs';
import { ListDetailAdapter } from '../list-detail-page.adapter';

type Actions = {
  openDialog: void;
  closeDialog: void;
  confirm: void;
};
@Component({
  standalone: true,
  selector: 'app-list-remove',
  templateUrl: './list-remove.component.html',
  styleUrls: ['./list-remove.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxActionFactory],
})
export default class ListRemoveComponent
  extends RxState<never>
  implements AfterViewInit, OnDestroy
{
  public adapter = inject(ListDetailAdapter);

  @ViewChild('dialog', { static: true }) dialog!: ElementRef<{
    showModal: () => void;
    close: () => void;
  }>;

  readonly ui = this.actionsF.create();

  constructor(private actionsF: RxActionFactory<Actions>) {
    super();
    this.hold(this.ui.confirm$, this.adapter.ui.deleteList);
  }

  ngAfterViewInit(): void {
    this.hold(merge(this.ui.confirm$, this.ui.closeDialog$), () =>
      this.dialog.nativeElement.close()
    );
    this.hold(this.ui.openDialog$, () => this.dialog.nativeElement.showModal());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
