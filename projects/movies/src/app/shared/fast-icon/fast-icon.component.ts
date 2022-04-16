import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IconRegistry } from './icon-registry.service';
import { isPlatformServer } from '@angular/common';

let element: HTMLElement = undefined as any;

function createGetImgFn(renderer: Renderer2): (src: string) => HTMLElement {
  if (element === undefined) {
    element = renderer.createElement('img');
    element.setAttribute(
      'style',
      'display: none; contain: content; content-visibility: auto;'
    );
    element.setAttribute('loading', 'lazy');
    element.setAttribute('width', '0');
    element.setAttribute('height', '0');
  }

  return (src: string) => {
    const e = element.cloneNode(true) as HTMLElement;
    e.setAttribute('src', src);
    return e;
  };
}

/**
 * ngx-fast-icon enables lazy loading features of the browser for SVG.
 * It also manages the caching of SVG's in the DOM for multiple usage and different stylings
 * This component also Supports lazy loading with SSR and http transfere cache
 * */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'fast-icon',
  template: `
    <!-- Icon - Displayed lazy or at bootstrap time from cache due to SSR or already loaded resources
    We use a DOM caching mechanism to display icon over the 'use' tag and an href attribute.
    - We display an empty SVG at the beginning. Invisible and without dimensions
    - On View init the size is applied even if no icon is loaded to avoid flickering in dimensions
    - A suspense icon is displayed at the same time to reduce visual flickering
    - when the real icon is loaded it is directly cached in the DOM and displayed over a new href value
     -->
    <svg class="fast-icon">
      <use></use>
    </svg>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .fast-icon {
        margin: 3px;
        /* leverage css perf features for older browsers not supporting content-visibility */
        contain: content;
        /* leverage contain:content improvements, exclude node completely from recalc styles if offscreen */
        content-visibility: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FastIconComponent implements AfterViewInit, OnDestroy {
  private sub = new Subscription();
  private readonly getImg = createGetImgFn(this.renderer);

  @Input()
  name: string = '';
  @Input()
  size: string = this.registry.defaultSize;
  @Input()
  width: string = '';
  @Input()
  height: string = '';
  // When the browser loaded the icon resource we trigger the caching mechanism
  // re-fetch -> cache-hit -> get SVG -> cache in DOM
  loadedListener = () => {
    this.registry.fetchIcon(this.name);
  };

  constructor(
    @Inject(PLATFORM_ID)
    private platform: Object,
    private renderer: Renderer2,
    private registry: IconRegistry,
    private element: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit() {
    if (!this.name) {
      throw new Error('icon component needs a name to operate');
    }
    // Setup view refs and init them
    const elem = this.element.nativeElement;

    const svg = elem.querySelector('svg') as SVGElement;
    // apply size
    if (this.size && svg) {
      // We apply fixed dimensions
      // Additionally to SEO rules, to avoid any scroll flicker caused by `content-visibility:auto` defined in component styles
      svg.setAttribute('width', this.width || this.size);
      svg.setAttribute('height', this.height || this.width || this.size);
    }

    let img: HTMLImageElement | null = null;

    // if icon is not in cache we append
    if (!this.registry.isIconCached(this.name)) {
      /**
       CSR - Browser native lazy loading hack

       We use an img element here to leverage the browsers native features:
       - lazy loading (loading="lazy") to only load the icons that are actually visible
       - priority hints to down prioritize the fetch to avoid delaying the LCP

       While the SVG is loading we display a fallback SVG.
       After the image is loaded we remove it from the DOM. (IMG load event)
       When the new icon arrives we append it to the template.

       Note:
       - the image is styled with display none. this prevents any loading of the resource ever.
       on component bootstrap we decide what we want to do. when we remove display none it performs the browser native behavior
       - the image has 0 height and with and containment as well as contnet-visibility to recuce any performance impact


       Edge cases:
       - only resources that are not loaded in the current session of the browser will get lazy loaded (same URL to trigger loading is not possible)
       - already loaded resources will get emitted from the cache immediately, even if loading is set to lazy :o
       - the image needs to have display other than none

       */
      const i = this.getImg(this.registry.url(this.name));
      this.renderer.appendChild(this.element.nativeElement, i);

      // get img
      img = elem.querySelector('img');
      img?.addEventListener('load', this.loadedListener);
    }

    // Listen to icon changes
    // This potentially could already receive the icon from the cache and drop the img from the DOM before it gets activated for lazy loading.
    // NOTICE:
    // If the icon is already cached the following code will execute synchronously. This gives us the chance to add
    this.sub = this.registry.iconHref$(this.name).subscribe((href) => {
      // The first child is the `use` tag. The value of href gets displayed as SVG
      svg.children[0].setAttribute('href', href);

      // early exit no image
      if (!img) return;

      // If the img is present
      // and the name in included in the href (icon is fully loaded, not only the suspense icon)
      // Remove the element from the DOM as it is no longer needed
      if (href.includes(this.name)) {
        img.removeEventListener('load', this.loadedListener);
        img.remove();
      }
    });

    // SSR
    if (isPlatformServer(this.platform)) {
      // No lazy loading hack used on SSR so we could remove the img tag
      // this.img.remove(); @Doublecheck
      // if SSR load icons on server => ends up in DOM cache and ships to the client
      this.registry.fetchIcon(this.name);
    }
    // CSR
    else {
      // Activate the lazy loading hack
      // Loading is triggered in the template over loading="lazy" and onload
      // Than the same image is fetched over HTTPClient and rendered as SVG. (This will result in a cache hit for this svg)
      //
      // If the img is present activate it
      img && img.style.setProperty('display', 'block');
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.element.nativeElement
      .querySelector('img')
      ?.removeEventListener('load', this.loadedListener);
  }
}
