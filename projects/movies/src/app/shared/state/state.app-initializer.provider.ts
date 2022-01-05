import { APP_INITIALIZER } from '@angular/core';
import { RouterEffects } from './router.effects';
import { GenreState } from './genre.state';

function initializeState(genreState: GenreState, effects: RouterEffects) {
  return (): void => {
    genreState.initialize();
    effects.initialize();
  };
}

/**
 * **🚀 Perf Tip for LCP, TTI:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export const GLOBAL_STATE_APP_INITIALIZER_PROVIDER = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeState,
    deps: [GenreState, RouterEffects],
    multi: true,
  },
];
