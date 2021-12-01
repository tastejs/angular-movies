import { APP_INITIALIZER } from '@angular/core';
import { StateService } from './state.service';

function initializeState(state: StateService) {
  return (): void => {
    state.init();
  };
}

/**
 * **🚀 Perf Tip for LCP, TTI:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export const stateAppInitializerProvider = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeState,
    deps: [StateService],
    multi: true
  }
];
