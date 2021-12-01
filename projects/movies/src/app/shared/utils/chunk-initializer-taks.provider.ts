import { APP_INITIALIZER } from '@angular/core';

function scheduleOnTimeout() {
  return (): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTimeout(() =>
        resolve()
      );
    });
  };
}

/**
 * **🚀 Perf Tip for LCP, TTI:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export const scheduledAppInitializerProvider = [
  {
    provide: APP_INITIALIZER,
    useFactory: scheduleOnTimeout,
    deps: [],
    multi: true
  }
];
