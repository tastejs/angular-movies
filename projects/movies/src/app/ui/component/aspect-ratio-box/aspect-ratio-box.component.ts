import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

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
  selector: 'ui-aspect-ratio-box',
  template: `
    <div class="aspect-ratio-box-inside">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./aspect-ratio-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class AspectRatioBoxComponent {
  @Input()
  set aspectRatio(aspectRatio: number) {
    this.paddingTop = calcPaddingTop(aspectRatio);
  }

  @HostBinding('style.paddingTop.%')
  paddingTop?: number;
}
