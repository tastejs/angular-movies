import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'hamburger-button'
  }
})
export class HamburgerButtonComponent {
}
