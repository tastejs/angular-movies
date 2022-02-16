import { select, selectSlice } from '@rx-angular/state/selections';
import { RxState } from '@rx-angular/state';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { filter, map, Observable, startWith } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { fallbackRouteToDefault } from '../../routing-default.utils';

export type RouterParams = {
  layout: 'list' | 'detail';
  type: 'person' | 'movie' | 'genre' | 'category' | 'search' | 'list';
  identifier: string;
};

/**
 * This service maintains the router state and repopulates it to its subscriber.
 */
@Injectable({
  providedIn: 'root',
})
export class RouterState extends RxState<RouterParams> {
  private _routerParams$: Observable<RouterParams> = this.router.events.pipe(
    select(
      filter((event) => event instanceof NavigationEnd),
      startWith('anyValue'),
      map((_) => {
        // This is a naive way to reduce scripting of router service :)
        // Obviously the params relly on routing structure heavily and could be done more dynamically
        const [layout, type, identifier] = fallbackRouteToDefault(
          this.document.location.pathname
        )
          .split('/')
          .slice(-3);
        return { layout, type, identifier };
      }),
      // emits if both values are given and set. (filters out undefined values)
      selectSlice(['layout', 'identifier', 'type'])
    )
  ) as unknown as Observable<RouterParams>;
  routerParams$ = this.select();

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    this.connect(this._routerParams$);
  }
}
