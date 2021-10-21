import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { BackdropComponentModule } from '../backdrop/backdrop.component';

@Component({
  selector: 'app-side-drawer',
  template: `
    <app-backdrop
      (click)="openedChange.next(false)"
      [opened]="opened"
    ></app-backdrop>
    <div class="side-drawer" [class.opened]="opened">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawerComponent {
  @Input() opened = false;
  @Output() openedChange = new Subject<boolean>();
}

@NgModule({
  imports: [BackdropComponentModule, CommonModule],
  exports: [SideDrawerComponent],
  declarations: [SideDrawerComponent],
})
export class SideDrawerComponentModule {}
