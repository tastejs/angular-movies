import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, Output } from '@angular/core';
import { BackdropComponentModule } from '../backdrop/backdrop.component';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideDrawerComponent {
  ui = getActions<{ openedChange: boolean }>();
  @Input() opened = false;
  @Output() openedChange = this.ui.openedChange$;
}

@NgModule({
  imports: [BackdropComponentModule, CommonModule],
  exports: [SideDrawerComponent],
  declarations: [SideDrawerComponent]
})
export class SideDrawerComponentModule {
}
