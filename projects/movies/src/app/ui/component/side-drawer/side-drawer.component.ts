import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { rxActions } from '@rx-angular/state/actions';

import { BackdropComponent } from '../backdrop/backdrop.component';

@Component({
  imports: [BackdropComponent],
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
  styleUrls: ['./side-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SideDrawerComponent {
  protected ui = rxActions<{ openedChange: boolean }>();
  @Input() opened = false;

  @Output() openedChange = this.ui.openedChange$;
}
