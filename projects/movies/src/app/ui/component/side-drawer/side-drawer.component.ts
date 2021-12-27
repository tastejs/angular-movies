import { ChangeDetectionStrategy, Component, Input, Output, ViewEncapsulation } from '@angular/core';
import { getActions } from '../../../shared/rxa-custom/actions';

@Component({
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
  encapsulation: ViewEncapsulation.Emulated
})
export class SideDrawerComponent {
  ui = getActions<{ openedChange: boolean }>();
  @Input() opened = false;
  @Output() openedChange = this.ui.openedChange$;
}
