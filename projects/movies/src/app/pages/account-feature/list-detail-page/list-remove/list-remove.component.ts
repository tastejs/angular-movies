import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { rxEffects } from '@rx-angular/state/effects';
import { rxActions } from '@rx-angular/state/actions';
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
})
export default class ListRemoveComponent implements AfterViewInit {
  public ef = rxEffects((e) =>
    e.register(this.ui.confirm$, this.adapter.ui.deleteList)
  );
  public adapter = inject(ListDetailAdapter);

  @ViewChild('dialog', { static: true }) dialog!: ElementRef<{
    showModal: () => void;
    close: () => void;
  }>;

  readonly ui = rxActions<Actions>();

  ngAfterViewInit(): void {
    this.ef.register(merge(this.ui.confirm$, this.ui.closeDialog$), () =>
      this.dialog.nativeElement.close()
    );
    this.ef.register(this.ui.openDialog$, () =>
      this.dialog.nativeElement.showModal()
    );
  }
}
