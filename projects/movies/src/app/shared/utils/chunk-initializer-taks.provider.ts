import { APP_INITIALIZER } from '@angular/core';

/**
 * **🚀 Perf Tip for TBT:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export const scheduledAppInitializerProvider = [
  {
    provide: APP_INITIALIZER,
    useFactory: () =>
      (): Promise<void> =>
        new Promise<void>((resolve) => {
          setTimeout(() =>
            resolve()
          );
        }),
    deps: [],
    multi: true
  }
];
