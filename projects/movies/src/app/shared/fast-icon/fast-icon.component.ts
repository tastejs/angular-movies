import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IconRegistry } from './icon-registry.service';
import { isPlatformServer } from '@angular/common';
import { SuspenseIcon } from './token/suspense-icon.token';
import { CreateIcon } from './create-icon.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'fast-icon',
  template: `
    <!-- CSR
    We use an img element here to leverage the browsers native features:
    - lazy loading (loading="lazy") to only load the icons that are actually visible
    - priority hints to down prioritize the fetch avoid delaying LCP img faster

    After the image is loaded we remove it from the DOM. (IMG load event)

    When the new icon arrives we append it to the (already empty) template

    Note: SSR trigger is in the class
    -->
    <img
      *ngIf="!isSSR"
      width="10"
      height="10"
      style="visibility: hidden;"
      loading="lazy"
      fetchpriority="lowest"
      [src]="'assets/' + name"
      (load)="notifyLoadSvg()"
    />
    <!-- a fallback icon is inserted below at bootstrap time -->
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FastIconComponent implements OnInit, OnDestroy {
  isSSR = isPlatformServer(this.platform);

  @Input()
  name: string = '';

  notifyLoadSvg = () => {
    console.log('notifyLoadSvg');
    this.registry.fetchIcon(this.name);

    // listen to icon changes if icon is visible - CSR & SSR
    this.sub
      .add
      /* this.registry.getIcon(this.name).subscribe((icon) => {
        const elem = this.element.nativeElement;

        elem.innerHTML = '';
        elem.innerHTML += `<svg class="icon"><use href='${icon}'></use></svg>`;
        this.applySize(elem.children[0] as HTMLElement);
        this.renderer.appendChild(elem, icon);
      }) */
      ();
  };

  @Input()
  size: string = this.registry.iconProvider.defaultSize + '';

  private sub = new Subscription();

  constructor(
    @Inject(PLATFORM_ID)
    private platform: Object,
    @Inject(SuspenseIcon)
    private suspenseIcon: CreateIcon,
    private registry: IconRegistry,
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    if (!this.name) {
      throw new Error('icon component needs a name to operate');
    }

    const elem = this.element.nativeElement;
    this.handleFallbackIcon(elem);

    // if SSR load icons on server => HTTP transfer state
    // Note: CSR trigger is in the template
    // this.isSSR && this.registry.fetchIcon(this.name);
  }

  handleFallbackIcon(view: HTMLElement) {
    if (!this.suspenseIcon) {
      return;
    }
    const icon = this.suspenseIcon();
    this.applySize(icon);
    this.renderer.appendChild(view, icon);
  }

  applySize(icon: HTMLElement) {
    if (this.size) {
      icon.setAttribute('width', this.size);
      icon.setAttribute('height', this.size);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
