import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-title',
  template: `
      <h1 class="title"><ng-content></ng-content></h1>
  `,
  styles: [
      `
      :host {
        display: contents;
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
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent {

}
