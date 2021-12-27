import { Injectable } from '@angular/core';
import { filter, map, Observable, OperatorFunction, pipe, startWith } from 'rxjs';
import { RxState, select, selectSlice } from '@rx-angular/state';
import { NavigationEnd, Router } from '@angular/router';

export type RouterParams = {
  type: 'genre' | 'category' | 'search';
  identifier: string;
};

const getIdentifierOfType = (filterType: string): OperatorFunction<RouterParams, string> => {
  return pipe(
    filter(({ type }: RouterParams) => type === filterType), map(({ identifier }) => identifier)
  );
};

/**
 * This service maintains the router state and repopulates it to it's subscriber.
 */
@Injectable({
  providedIn: 'root'
})
export class RouterStateService extends RxState<RouterParams>{

  private _routerParams$: Observable<RouterParams> = this.router.events
    .pipe(
      select(
        filter(event => event instanceof NavigationEnd),
        startWith('anyValue'),
        map(_ => {
          // This is a naive way to reduce scripting of router service :)
          // Obviously the params ane not properly managed
          const [type, identifier] = window.location.href.split('/').slice(-2);
          return { type, identifier };
        }),
        // emits if both values are given and set. (filters out undefined values)
        selectSlice(['identifier', 'type'])
      )
    ) as unknown as Observable<RouterParams>;
  routerParams$ = this.select();
  routerSearch$ = this.select(getIdentifierOfType('search'));
  routerGenre$ = this.select(getIdentifierOfType('genre'));
  routerCategory$ = this.select(getIdentifierOfType('category'));

  constructor(private router: Router) {
    super();
    this.connect(this._routerParams$)
  }
}
