import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-container',
  template: `
      <div class="container"><ng-content></ng-content></div>
  `,
  styles: [
      `
      :host {
        display: contents;
        padding-right: 4rem;
        padding-left: 4rem;
      }
      @import './continer.component.scss';
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {

}
