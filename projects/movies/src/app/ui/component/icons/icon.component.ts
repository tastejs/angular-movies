import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IconRegistry } from './icon-registry.service';

// credits go here: https://github.com/czeckd/angular-svg-icon/blob/bbd269df33fe74f7b474c1eb6322de432890c2d4/projects/angular-svg-icon/src/lib/svg-icon.component.ts

/**
 * a very simple component to render svgs from the registry.
 * it cannot react to changes of inputs, it will render whatever you will put in first
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg-icon',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: inline-block;
        width: 24px;
        height: 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent implements OnInit, OnDestroy {
  @Input() name?: string;

  @HostBinding('style.width')
  @HostBinding('style.height')
  @Input()
  size?: string;

  private sub = new Subscription();

  constructor(
    private registry: IconRegistry,
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    if (!this.name) {
      throw new Error('svg-icon component needs a name to operate');
    }
    this.sub.add(
      this.registry.getSvgByName(this.name)?.subscribe((svg) => {
        if (svg) {
          const icon = svg.cloneNode(true) as SVGElement;
          const elem = this.element.nativeElement;
          elem.innerHTML = '';
          this.renderer.appendChild(elem, icon);
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
