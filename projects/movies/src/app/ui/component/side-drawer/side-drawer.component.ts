import { ChangeDetectionStrategy, Component, Input, Output, ViewEncapsulation } from '@angular/core';
import { getActions } from '../../../shared/rxa-custom/actions';

@Component({
  selector: 'app-side-drawer',
  template: `
    <app-backdrop
      (click)="ui.openedChange(false)"
      [opened]="opened"
    ></app-backdrop>
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
