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
      *ngIf="withBackdrop"
      (click)="openedChange.next(false)"
      [opened]="opened"
    ></app-backdrop>
    <div class="side-drawer" [class.opened]="opened">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .side-drawer {
        position: fixed;
        width: 250px;
        max-width: 70%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: var(--theme-drawer-zIndex);
        padding: 32px 16px;
        overflow-y: auto;
        box-sizing: border-box;
        transition: transform var(--theme-anim-duration-short)
          var(--theme-anim-easing-easeOut);
        box-shadow: var(--theme-shadow-16);
        background-color: var(--palette-background-paper);
      }
      .side-drawer {
        transform: translateX(-100%);
      }
      .side-drawer.opened {
        transform: translateX(0);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideDrawerComponent {
  @Input() withBackdrop = true;
  @Input() opened = false;
  @Output() openedChange = new Subject<boolean>();
}

@NgModule({
  imports: [BackdropComponentModule, CommonModule],
  exports: [SideDrawerComponent],
  declarations: [SideDrawerComponent],
})
export class SideDrawerComponentModule {}
