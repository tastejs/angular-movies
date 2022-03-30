import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  distinctUntilChanged,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  Subject
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IconProvider } from './icon-provider.token';
import { IconProviderToken } from './icon-provider.model';

const createIconFromUrl = (
  container: HTMLElement,
  iconCfg: { url: string; name: string }
): HTMLElement => {
  const { url, name } = iconCfg;
  container.innerHTML = `<svg data-name="${name}"><use xlink:href='${url}#${name}'></use></svg>`;
  return container.children[0].cloneNode(true) as HTMLElement;
};

const createIconFromString = (
  container: HTMLElement,
  iconSvg: string
): HTMLElement => {
  container.innerHTML = iconSvg;
  return container.children[0].cloneNode(true) as HTMLElement;
};

@Injectable({
  providedIn: 'root'
})
export class IconCache {
  private readonly _iconMap = new Map<string, Subject<HTMLElement>>();

  storeIconName(name: string, url: string): void {
    const icon = createIconFromUrl(this.document.createElement('DIV'), {
      name,
      url
    });
    this.getIconStream(name).next(icon);
  }

  constructor(
    @Optional()
    @Inject(DOCUMENT)
    private document: Document,
    private http: HttpClient,
    @Inject(IconProvider)
    public iconProvider: IconProviderToken) {
    // @TODO preloading all icons optional
  }

  loadIconOverHttp(name: string): void {
    // only fetch 1 time
    if (this._iconMap.has(name)) {
      return;
    }
    this.http
      .get(this.iconProvider.url(name), { responseType: 'text' })
      .subscribe((body) => {
        this.storeIconSvg(name, body);
      });
  }

  getIcon(name: string): Observable<HTMLElement> {
    return this.getIconStream(name)
      .asObservable()
      .pipe(
        distinctUntilChanged((a, b) => a.innerHTML === b.innerHTML),
        map((i) => i.cloneNode(true) as HTMLElement),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  private getIconStream(name: string): Subject<HTMLElement> {
    if (!this._iconMap.has(name)) {
      this._iconMap.set(name, new ReplaySubject<HTMLElement>(1));
    }
    return this._iconMap.get(name) as Subject<HTMLElement>;
  }

  private storeIconSvg(name: string, svg: string): void {
    const icon = createIconFromString(this.document.createElement('DIV'), svg);
    this.getIconStream(name).next(icon);
  }
}
