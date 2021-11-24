import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

/**
 * **🚀 Perf Tip for TBT:**
 *
 * Reduce scripting time by caching results of pure calculations.
 */
const paddingTopMap = new Map<number, number>();
function calcPaddingTop(ratio: number): number {
  if (paddingTopMap.get(ratio) === undefined) {
    paddingTopMap.set(ratio, (1 / ratio) * 100);
  }
  return paddingTopMap.get(ratio) as number;
}

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
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AspectRatioBoxComponent {
  @Input()
  set aspectRatio(aspectRatio: number) {
    this.paddingTop = calcPaddingTop(aspectRatio);
  }

  @HostBinding('style.paddingTop.%')
  paddingTop?: number;
}
