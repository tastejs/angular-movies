import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-aspect-ratio-box',
  template: `
    <div class="aspect-ratio-box-inside">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      /*
    host is replacement for .aspect-ratio-box
    */
      :host {
        display: block;
        height: 0;
        overflow: hidden;
        position: relative;
      }

      .aspect-ratio-box-inside {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AspectRatioBoxComponent {
  @Input()
  set aspectRatio(aspectRatio: number) {
    this.paddingTop = (1 / aspectRatio) * 100;
  }

  @HostBinding('style.paddingTop.%')
  paddingTop?: number;
}
