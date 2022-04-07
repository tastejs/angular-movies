import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IconProviderToken } from './token/icon-provider.token';
import { IconProvider } from './token/icon-provider.model';
import { SuspenseIcon } from './token/suspense-icon.token';

// @TODO compose icons in 1 sprite and fetch by id as before

let element: HTMLElement | undefined = undefined;

function createDomParser(document: Document): (s: string) => HTMLElement {
  const e = element || document.createElement('DIV');
  return (s: string) => {
    e && (e.innerHTML = s);
    return e.firstChild as HTMLElement;
  };
}

function styleDomCacheForPerformace(el: HTMLElement): HTMLElement {
  /**
   * reduce paint area with with/height 0 and overflow hidden
   * fixed position of -2000px to always have it offscreen and outside of any native trigger (viewport observer in content visibilits)
   * contain:content to leverage css perf features for older browsers not supporting content-visibility
   * content-visibility: auto to exclude it completely from recalc styles
   */
  el.setAttribute(
    'style',
    `
    overflow: hidden;
    width: 0px;
    height: 0px;
    position: fixed;
    bottom: -2000px;
    contain: content;
    content-visibility: auto;
  `
  );
  return el;
}

@Injectable({
  providedIn: 'root',
})
export class IconRegistry {
  private readonly domParser = createDomParser(this.document);
  private readonly svgDomCache: HTMLElement = (() => {
    // The DOM cache could be already created on SSR or due to multiple instances of the registry
    const domCache =
      this.document.getElementById('svg-cache') ||
      this.domParser(`<div id="svg-cache"></div>`);
    styleDomCacheForPerformace(domCache);
    this.document.body.appendChild(domCache);
    return domCache;
  })();

  private readonly _iconHrefCache = new Map<string, BehaviorSubject<string>>();
  private readonly _cachedIcons = new Set();

  constructor(
    @Optional()
    @Inject(DOCUMENT)
    private document: Document,
    @Inject(SuspenseIcon)
    private suspenseIcon: string,
    @Inject(IconProviderToken)
    public iconProvider: IconProvider
  ) {
    this.hydrateFromDom();
  }

  private hydrateFromDom(): void {
    // hydrate DOM cache
    Array.from(this.svgDomCache.children).forEach((i) => {
      // add to fetchedIcons
      this._cachedIcons.add(i.id);
      // publish to components and render it
      this.getIconSubject(i.id).next(i.id);
    });

    // configure suspense icon
    const suspenseIconId = this.iconId('suspense');
    !this._cachedIcons.has(suspenseIconId) &&
      this.cacheSvgInDOM(suspenseIconId, this.suspenseIcon);
  }

  fetchIcon = (iconName: string): void => {
    const iconId = this.iconId(iconName);

    // if the svg is already fetched we return early
    if (this._cachedIcons.has(iconId)) {
      return;
    }
    this._cachedIcons.add(iconId);

    // trigger fetch
    this.iconProvider
      .load(this.iconProvider.url(iconName))
      .subscribe((body) => {
        this.cacheSvgInDOM(iconId, body);
      });
  };

  isIconCached(name: string): boolean {
    return this._cachedIcons.has(this.iconId(name));
  }

  iconHref$(name: string): Observable<string> {
    // start by displaying the suspense icon immediately
    return this.getIconSubject(this.iconId(name)).pipe(map((id) => `#${id}`));
  }

  private cacheSvgInDOM(iconId: string, svgString: string): void {
    // create HTML
    const svgElem = this.domParser(svgString);
    // the SVG element needs to be accessible over a href and end with a specific anchor to select the element by id
    svgElem.setAttribute('id', iconId);
    this.svgDomCache.appendChild(svgElem);
    // notify subscribers about change
    this.getIconSubject(iconId).next(iconId);
  }

  private getIconSubject(iconId: string): BehaviorSubject<string> {
    if (!this._iconHrefCache.has(iconId)) {
      this._iconHrefCache.set(
        iconId,
        new BehaviorSubject<string>(this.iconId('suspense'))
      );
    }
    return this._iconHrefCache.get(iconId) as BehaviorSubject<string>;
  }

  // pattern has to be `#<provideID>-<iconName>`
  private iconId(name: string): string {
    return `${this.iconProvider.id}-${name}`;
  }
}
