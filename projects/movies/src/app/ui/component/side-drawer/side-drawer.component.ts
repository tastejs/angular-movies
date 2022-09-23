import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { RxActionFactory } from '../../../shared/rxa-custom/actions';
import { CommonModule } from '@angular/common';
import { BackdropComponent } from '../backdrop/backdrop.component';

@Component({
  standalone: true,
  imports: [CommonModule, BackdropComponent],
  selector: 'ui-side-drawer',
  template: `
    <ui-backdrop
      (click)="ui.openedChange(false)"
      [opened]="opened"
    ></ui-backdrop>
    <div class="side-drawer" [class.opened]="opened">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxActionFactory],
})
export class SideDrawerComponent {
  ui = this.actions.create();
  @Input() opened = false;
  @Output() openedChange = this.ui.openedChange$;

  constructor(private actions: RxActionFactory<{ openedChange: boolean }>) {}
}
