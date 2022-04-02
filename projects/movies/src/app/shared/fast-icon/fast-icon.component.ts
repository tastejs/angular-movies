import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IconRegistry } from './icon-registry.service';
import { isPlatformServer } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'fast-icon',
  template: `
    <!-- CSR - Browser native lazy loading hack
    We use an img element here to leverage the browsers native features:
    - lazy loading (loading="lazy") to only load the icons that are actually visible
    - priority hints to down prioritize the fetch avoid delaying LCP img faster

    After the image is loaded we remove it from the DOM. (IMG load event)

    When the new icon arrives we append it to the (already empty) template

    Edge cases:
    - only resources that are not loaded in this visite of the website will get lazy loaded
    - already loaded resources will get emitted from the cache immediately, even if loading is set to lazy :o
    - the image needs to have display other than none

    Note:
    SSR trigger is in the class in onInit
    -->
    <img
      style="display: none"
      width="0"
      height="0"
      loading="lazy"
      fetchpriority="lowest"
      [src]="url"
      (load)="notifyLoadSvg()"
    />
    <!-- a fallback icon is inserted below at bootstrap time -->
    <svg class="icon">
      <use href=""></use>
    </svg>
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
export class FastIconComponent implements AfterViewInit, OnDestroy {
  isSSR = isPlatformServer(this.platform);

  svg: SVGElement | null = null;
  img: HTMLImageElement | null = null;

  get url() {
    return this.registry.iconProvider.url(this.name);
  }

  @Input()
  name: string = '';

  updateIcon = (href: string): void => {
    if (this.svg) {
      this.applySize();
      this.svg.children[0].setAttribute('href', href);
    }
  };

  notifyLoadSvg = () => {
    this.registry.fetchIcon(this.name);
  };

  @Input()
  size: string = this.registry.iconProvider.defaultSize + '';

  private sub = new Subscription();

  constructor(
    @Inject(PLATFORM_ID)
    private platform: Object,
    private registry: IconRegistry,
    private element: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit() {
    if (!this.name) {
      throw new Error('icon component needs a name to operate');
    }
    // Setup view refs
    const elem = this.element.nativeElement;
    this.img = elem.querySelector('img') as HTMLImageElement;
    this.svg = elem.querySelector('svg') as SVGElement;

    // SSR
    if (this.isSSR) {
      // No lazy loading hack used on SSR so we could remove the icon
      // this.img.remove(); @Doublecheck
      // if SSR load icons on server => HTTP transfer state
      this.registry.fetchIcon(this.name);
    }
    // CSR
    else {
      // Trigger is in the template over loading="lazy" and (onload)
      // Than the same image is fetched over HTTPClient and rendered as SVG
      this.img.setAttribute('style', '');
    }
    // listen to icon changes
    this.sub.add(this.registry.iconHref$(this.name).subscribe(this.updateIcon));
  }

  applySize() {
    if (this.size && this.svg) {
      this.svg.setAttribute('width', this.size);
      this.svg.setAttribute('height', this.size);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
