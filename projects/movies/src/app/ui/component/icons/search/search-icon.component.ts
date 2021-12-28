import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-search-icon',
  templateUrl: './search-icon.component.svg',
  styles: [
    `
      svg {
        fill: currentColor;
        width: 1.125em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class SearchIconComponent {}
