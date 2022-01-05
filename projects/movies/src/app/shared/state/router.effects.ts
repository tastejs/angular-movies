import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RouterParams } from './router-state.interface';
import { RouterState } from './router.state';
import { PersonState } from './person.state';
import { MovieState } from './movie.state';
import { DiscoverState } from './discover.state';
import { AppInitializer } from '../rxa-custom/app-initializer';

/**
 * This service manages data fetching based on router params
 */
@Injectable({
  providedIn: 'root',
})
export class RouterEffects extends RxState<any> implements AppInitializer {
  constructor(
    private routerState: RouterState,
    private discoverState: DiscoverState,
    private personState: PersonState,
    private movieState: MovieState
  ) {
    super();
  }

  // The routerState will initially emit the current params
  // Initially only resources present in the current URL are loaded, not all the listed once
  initialize(): void {
    this.hold(this.routerState.routerParams$, this.routerFetchEffect);
  }

  private routerFetchEffect = ({
    layout,
    type,
    identifier,
  }: RouterParams): void => {
    if (type === 'category') {
      this.movieState.initialize({ category: identifier });
    } else if (type === 'genre') {
      this.discoverState.initialize(identifier);
    } else if (layout === 'detail' && type === 'movie') {
      this.movieState.initialize({ movieId: identifier });
    } else if (layout === 'detail' && type === 'person') {
      this.personState.initialize(identifier);
    }
  };
}
