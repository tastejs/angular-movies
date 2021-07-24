import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core';

@Component({
  selector: 'app-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'hamburger-button',
  },
})
export class HamburgerButtonComponent {}

@NgModule({
  declarations: [HamburgerButtonComponent],
  exports: [HamburgerButtonComponent],
})
export class HamburgerButtonModule {}
