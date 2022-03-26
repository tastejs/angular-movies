import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  catchError,
  from,
  map,
  merge,
  Observable,
  shareReplay,
  throwError,
} from 'rxjs';
import { SUPPORTED_ICONS, SupportedIcons } from './suported-icons';

@Injectable()
/**
 * Registry inspired by angular-svg-icon project
 * @see https://github.com/czeckd/angular-svg-icon/blob/master/projects/angular-svg-icon/src/lib/svg-icon-registry.service.ts
 */
export class IconRegistry {
  private readonly _iconMap = new Map<string, Observable<SVGElement>>();

  constructor(@Optional() @Inject(DOCUMENT) private document: Document) {
    // preload all icons
    merge(
      ...SUPPORTED_ICONS.map((iconName) => this.loadSvg(iconName))
    ).subscribe();
  }

  loadSvg(
    name: SupportedIcons
  ): Observable<SVGElement | undefined> | undefined {
    if (this._iconMap.has(name)) {
      return this._iconMap.get(name);
    }
    const o$ = from(
      import(`../../../../assets/svg-icons/${name}.svg?raw`).then(
        (m) => m.default
      )
    ).pipe(
      map((svg) => {
        const div = this.document.createElement('DIV');
        div.innerHTML = svg;
        return div.querySelector('svg') as SVGElement;
      }),
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
  getSvgByName(
    name: SupportedIcons
  ): Observable<SVGElement | undefined> | undefined {
    if (this._iconMap.has(name)) {
      return this._iconMap.get(name);
    }
    return throwError(() => `No svg with name '${name}' has been loaded`);
  }
}
