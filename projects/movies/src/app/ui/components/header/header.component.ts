import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-header',
  template: `
    <div class="header">
      <ds-title>
        <ng-content select="[title]"></ng-content>
      </ds-title>
      <ds-subtitle>
        <ng-content select="[subtitle]"></ng-content>
      </ds-subtitle>
    </div>
  `,
  styles: [
      `
      :host {
        display: contents;
      }

      .header {
        margin-bottom: 2rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

}
