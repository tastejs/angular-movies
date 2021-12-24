import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-header',
  template: `
    <h1><ng-content select="[title]"></ng-content></h1>
    <h2><ng-content select="[subtitle]"></ng-content></h2>
  `,
  styles: [
      `
      :host {
        display: block;
        margin-bottom: 2rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

}
