import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  catchError,
  finalize,
  map,
  merge,
  Observable,
  of,
  share,
  tap,
  throwError,
} from 'rxjs';
import { getHTTP } from '../../../shared/injector/get-http-client';

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
];

// credits go here: https://github.com/czeckd/angular-svg-icon/blob/master/projects/angular-svg-icon/src/lib/svg-icon-registry.service.ts

@Injectable()
export class IconRegistry {
  private readonly iconMap = new Map<string, SVGElement>();
  private readonly loadingMap = new Map<string, Observable<SVGElement>>();

  constructor(
    // TODO: check what happens on SSR
    // @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(DOCUMENT) private document: Document
  ) {
    // preload all icons
    merge(
      ...icons.map((i) => this.loadSvg(`/assets/svg-icons/${i}.svg`, i))
    ).subscribe();
  }

  loadSvg(
    url: string,
    name: string
  ): Observable<SVGElement | undefined> | undefined {
    if (this.iconMap.has(name)) {
      return of(this.iconMap.get(name));
    } else if (this.loadingMap.has(name)) {
      return this.loadingMap.get(name);
    }
    const o$ = getHTTP()
      .get(url, { responseType: 'text' })
      .pipe(
        map((svg) => {
          const div = this.document.createElement('DIV');
          console.log(svg);
          div.innerHTML = svg;
          return div.querySelector('svg') as SVGElement;
        }),
        tap((svg) => this.iconMap.set(name, svg)),
        catchError((err) => {
          console.error(err);
          return throwError(err);
        }),
        finalize(() => this.loadingMap.delete(name)),
        share()
      ) as Observable<SVGElement>;

    this.loadingMap.set(name, o$);
    return o$;
  }

  /** Get loaded SVG from registry by name. (also works by url because of blended map) */
  getSvgByName(name: string): Observable<SVGElement | undefined> | undefined {
    if (this.iconMap.has(name)) {
      return of(this.iconMap.get(name));
    } else if (this.loadingMap.has(name)) {
      return this.loadingMap.get(name);
    }
    return throwError(() => `No svg with name '${name}' has been loaded`);
  }
}
