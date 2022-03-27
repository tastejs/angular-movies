import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  distinctUntilChanged,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  Subject,
} from 'rxjs';
import { iconProvider } from './icon-data';
import { HttpClient } from '@angular/common/http';

const createIconFromUrl = (
  container: HTMLElement,
  iconCfg: { url: string; name: string }
): SVGElement => {
  const { url, name } = iconCfg;
  container.innerHTML = `<svg id="${name}" viewBox="0 0 24 24"><use xlink:href='${url}#${name}'></use></svg>`;
  return container.children[0].cloneNode(true) as SVGElement;
};

const createIconFromString = (
  container: HTMLElement,
  iconSvg: string
): SVGElement => {
  container.innerHTML = iconSvg;
  return container.children[0].cloneNode(true) as SVGElement;
};

@Injectable({
  providedIn: 'root',
})
export class IconRegistry {
  private readonly _iconMap = new Map<string, Subject<SVGElement>>();

  defaultProvider = iconProvider;

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
    private http: HttpClient
  ) {
    // @TODO preloading all icons
  }

  loadIconOverHttp(name: string): void {
    // only fetch 1 time
    if (this._iconMap.has(name)) {
      return;
    }
    this.http
      .get(this.defaultProvider(name), { responseType: 'text' })
      .subscribe((body) => {
        this.storeIconSvg(name, body);
      });
  }

  getIcon(name: string): Observable<SVGElement> {
    return this.getIconStream(name)
      .asObservable()
      .pipe(
        distinctUntilChanged((a, b) => a.innerHTML === b.innerHTML),
        map((i) => i.cloneNode(true) as SVGElement),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  private getIconStream(n: string): Subject<SVGElement> {
    if (!this._iconMap.has(n)) {
      this._iconMap.set(n, new ReplaySubject<SVGElement>(1));
    }
    return this._iconMap.get(n) as Subject<SVGElement>;
  }

  private storeIconSvg(name: string, svg: string): void {
    const icon = createIconFromString(this.document.createElement('DIV'), svg);
    this.getIconStream(name).next(icon);
  }
}
