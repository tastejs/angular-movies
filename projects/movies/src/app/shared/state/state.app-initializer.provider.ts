import { APP_INITIALIZER } from '@angular/core';
import { RouterEffects } from './router.effects';
import { getGenresStateful } from '../../data-access/api/resources/genre.resource';

function initializeState(effects: RouterEffects) {
  return (): void => {
    // sideBar
    getGenresStateful();
    // routes
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
    deps: [RouterEffects],
    multi: true,
  },
];
