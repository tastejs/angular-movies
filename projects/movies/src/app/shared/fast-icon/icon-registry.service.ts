import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IconProviderToken } from './token/icon-provider.token';
import { IconProvider } from './token/icon-provider.model';
import { SuspenseIcon } from './token/suspense-icon.token';

// @TODO compose icons in 1 sprite and fetch by id as before

@Injectable({
  providedIn: 'root',
})
export class IconRegistry {
  private readonly _fetchedIcons = new Set();
  private readonly _iconMap = new Map<string, BehaviorSubject<string>>();

  // pattern has to be `#<provideID>-<iconName>`
  iconId(name: string): string {
    return `${this.iconProvider.id}-${name}`;
  }

  constructor(
    @Optional()
    @Inject(DOCUMENT)
    private document: Document,
    @Inject(SuspenseIcon)
    suspenseIcon: string,
    @Inject(IconProviderToken)
    public iconProvider: IconProvider
  ) {
    this.cacheSvgInDOM('suspense', suspenseIcon);
    // @TODO preloading all icons in rendered templates
  }

  fetchIcon(iconName: string): void {
    const iconId = this.iconId(iconName);

    // if the svg is already fetched we return early
    if (this._fetchedIcons.has(iconId)) {
      return;
    }
    this._fetchedIcons.add(iconId);

    // trigger fetch
    this.iconProvider
      .load(this.iconProvider.url(iconName))
      .subscribe((body) => {
        this.cacheSvgInDOM(iconId, body);
      });
  }

  iconHref$(name: string): Observable<string> {
    // start by displaying the suspense icon immediately
    return this.getIconSubject(name)
      .asObservable()
      .pipe(map((id) => `#${id}`));
  }

  private cacheSvgInDOM(name: string, svgString: string): void {
    // create HTML
    const _ = this.document.createElement('div');
    _.innerHTML = svgString;
    const svgElem = _.children[0];
    // the svg element needs to be accessible over a href and end with a specific anchor to select the element by id
    svgElem.setAttribute('id', this.iconId(name));
    this.document.body.appendChild(svgElem);
    // notify subscribers about change
    this.getIconSubject(name).next(`${this.iconId(name)}`);
  }

  private setupIconSubject(name: string): void {
    if (!this._iconMap.has(name)) {
      this._iconMap.set(
        name,
        new BehaviorSubject<string>(this.iconId('suspense'))
      );
    }
  }

  private getIconSubject(name: string): BehaviorSubject<string> {
    this.setupIconSubject(name);
    return this._iconMap.get(name) as BehaviorSubject<string>;
  }
}
