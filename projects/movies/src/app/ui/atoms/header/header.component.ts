import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-header',
  template: `
    <h1 class="title"><ng-content select="[title]"></ng-content></h1>
    <h2 class="subtitle">
      <ng-content select="[subtitle]"></ng-content>
    </h2>
  `,
  styles: [
      `
      :host {
        display: block;
        margin-bottom: 2rem;
      }

      .title {
        margin-bottom: 0.5rem;
        color: var(--palette-text-primary);
        font-size: 3rem;
        font-weight: 300;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: -0.5px;
      }

      .subtitle {
        color: var(--palette-text-secondary);
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        text-transform: uppercase;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

}
