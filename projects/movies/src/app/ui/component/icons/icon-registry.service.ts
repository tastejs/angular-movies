import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  catchError,
  Observable,
  of,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

const iconProvider = (name: string) => `/assets/svg-icons/${name}.svg`;
const icons = [
  'account',
  'back',
  'genre',
  'imdb',
  'play',
  'popular',
  'search',
  'top_rated',
  'upcoming',
  'website',
  'delete',
  'sad',
  'error',
];
icons;

// credits go here: https://github.com/czeckd/angular-svg-icon/blob/master/projects/angular-svg-icon/src/lib/svg-icon-registry.service.ts

@Injectable()
export class IconRegistry {
  private readonly _iconMap = new Map<string, Observable<SVGElement>>();

  constructor(
    // TODO: check what happens on SSR
    // @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(DOCUMENT) private document: Document
  ) {
    // preload all icons
    // merge(...icons.map((i) => this.loadSvg(i))).subscribe();
  }

  loadSvg(name: string): Observable<SVGElement> {
    const url = iconProvider(name);
    if (this._iconMap.has(name)) {
      return this._iconMap.get(name) as Observable<SVGElement>;
    }
    this.document.querySelector(`[data-svg-icon="${name}"]`);
    const div = this.document.createElement('DIV');
    div.innerHTML = `<svg viewBox="0 0 24 24">
                        <use xlink:href='${url}#${name}'></use>
                     </svg>`;
    const svgElem = div.querySelector('svg') as SVGElement;
    const o$ = of(svgElem).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(err);
      }),
      shareReplay(1)
    ) as Observable<SVGElement>;
    this._iconMap.set(name, o$);
    return o$;
  }

  /** Get loaded SVG from registry by name. (also works by url because of blended map) */
  getSvgByName(name: string): Observable<SVGElement> {
    return new Observable<boolean>((s) => s.next(this._iconMap.has(name))).pipe(
      switchMap((hasName) =>
        hasName
          ? (this._iconMap.get(name) as Observable<SVGElement>)
          : this.loadSvg(name)
      )
      // @TODO handle errors
    );
  }
}
