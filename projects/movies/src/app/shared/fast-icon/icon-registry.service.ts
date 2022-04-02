import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, ReplaySubject, shareReplay, Subject } from 'rxjs';
import { IconProviderToken } from './token/icon-provider.token';
import { IconProvider } from './token/icon-provider.model';

const createIconFromUrl = (
  container: any,
  iconCfg: { url: string; name: string }
): any => {
  const { url, name } = iconCfg;
  container.innerHTML &&
    `<svg data-name="${name}"><use href='${url}#${name}'></use></svg>`;
  return container.children[0].cloneNode(true) as any;
};

const createIconFromString = (
  container: any,
  data: { iconSvg: string; name: string; providerId: string }
): any => {
  const { iconSvg, name, providerId } = data;
  container.innerHTML = iconSvg;
  const i = container.children[0];
  // the svg element needs to be accessible ofer a href and end with a specific anchor to select a the element by id
  i.setAttribute('id', `${providerId}-${name}`);
  return i;
};

@Injectable({
  providedIn: 'root',
})
export class IconRegistry {
  private readonly _iconMap = new Map<string, Subject<any>>();

  storeIconName(name: string, url: string): void {
    const icon = createIconFromUrl(this.document.createElement('DIV'), {
      name,
      url,
    });
    this.getIconStream(name).next(icon);
  }

  constructor(
    @Optional()
    @Inject(DOCUMENT)
    private document: Document,
    @Inject(IconProviderToken)
    public iconProvider: IconProvider
  ) {
    // @TODO preloading all icons optional
  }

  fetchIcon(providerIdAndName: string): void {
    console.log('fetchIcon: ', this._iconMap.has(providerIdAndName));
    // is already fetched or in progress
    if (this._iconMap.has(providerIdAndName)) {
      return;
    }

    // flag icon as in progress
    this.setupIconStream(providerIdAndName);

    // trigger fetch
    this.iconProvider
      .load(this.iconProvider, providerIdAndName)
      .subscribe((body) => {
        this.storeIconSvg(providerIdAndName, body);
      });
  }

  getIcon(name: string): Observable<any> {
    return this.getIconStream(name)
      .asObservable()
      .pipe(
        //  map((i) => i.cloneNode(true) as any),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  private setupIconStream(name: string): void {
    if (!this._iconMap.has(name)) {
      this._iconMap.set(name, new ReplaySubject<any>(1));
    }
  }
  private getIconStream(name: string): Subject<any> {
    this.setupIconStream(name);
    return this._iconMap.get(name) as Subject<any>;
  }

  private storeIconSvg(name: string, iconSvg: string): void {
    const icon = createIconFromString(this.document.createElement('DIV'), {
      iconSvg,
      providerId: this.iconProvider.id,
      name,
    });
    this.document.body.appendChild(icon);
    this.getIconStream(name).next(`#${this.iconProvider.id}-${name}`);
  }
}
