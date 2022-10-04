import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from 'projects/movies/src/app/shared/rxa-custom/actions';
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
export class ListRemoveComponent
  extends RxState<never>
  implements AfterViewInit, OnDestroy
{
  @ViewChild('dialog', { static: true }) dialog!: ElementRef<{
    showModal: () => void;
    close: () => void;
  }>;

  readonly ui = this.actionsF.create();

  constructor(
    public adapter: ListDetailAdapter,
    private actionsF: RxActionFactory<Actions>
  ) {
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
