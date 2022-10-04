import { NgZone, ɵNoopNgZone } from '@angular/core';
import { RxActionFactory } from './shared/rxa-custom/actions';
import { TMDB_HTTP_INTERCEPTORS_PROVIDER } from './shared/auth/tmdb-http-interceptor.providers';
import { GLOBAL_STATE_APP_INITIALIZER_PROVIDER } from './shared/state/state-app-initializer.provider';
import { SCHEDULED_APP_INITIALIZER_PROVIDER } from './shared/app-initializer/chunk-app-initializer.provider';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';
import {
  provideRouter,
  withDisabledInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { ROUTES } from './app.routing';

export const APP_PROVIDERS = [
  provideRouter(
    ROUTES,
    // withDebugTracing(),
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Disable initial sync navigation in router config and schedule it in router-outlet container component
     */
    withDisabledInitialNavigation(),
    withInMemoryScrolling({
      /**
       * **💡 UX Tip for InfiniteScroll:**
       *
       * Reset scroll position to top on route change, users could be
       * irritated starting a new list from the bottom of the page.
       *
       * also: otherwise infinite scroll isn't working properly
       */
      scrollPositionRestoration: 'top',
    })
  ),
  /**
   * **🚀 Perf Tip for LCP, TTI, TBT:**
   *
   * Disable zone.js as change detection system.
   * Add { ngZone: 'noop' } to the bootstrap options
   *
   * ⚠ Notice:
   * Don't forget to:
   * - remove `zone.js` import from the `polyfills.ts` file
   * - trigger change detection manually after NavigationEnd (or use the provided helper `ZonelessRouting`)
   *
   * 💡 Additional Optimization:
   * Remove the `polyfills` option from your `angular.json` to save 1 request and 118b
   *
   */
  // equivalent to `.bootstrapModule(AppModule, { ngZone: 'noop' })`
  {
    provide: NgZone,
    useClass: ɵNoopNgZone,
  },
  RxActionFactory,
  TMDB_HTTP_INTERCEPTORS_PROVIDER,
  /**
   * **🚀 Perf Tip for LCP, TTI:**
   *
   * Fetch data visible in viewport on app bootstrap instead of component initialization.
   */
  GLOBAL_STATE_APP_INITIALIZER_PROVIDER,
  /**
   * **🚀 Perf Tip for TBT:**
   *
   * Chunk app bootstrap over APP_INITIALIZER.
   */
  SCHEDULED_APP_INITIALIZER_PROVIDER,
  /**
   * **🚀 Perf Tip for TBT, LCP, CLS:**
   *
   * Configure RxAngular to get maximum performance.
   */
  RXA_PROVIDER,
];
