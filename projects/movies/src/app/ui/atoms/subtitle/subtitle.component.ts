import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-subtitle',
  template: `
      <h2 class="subtitle"><ng-content></ng-content></h2>
  `,
  styles: [
      `
      :host {
        display: contents;
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
export class SubtitleComponent {

}
