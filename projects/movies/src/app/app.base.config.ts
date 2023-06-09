import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import {provideRouter, withDisabledInitialNavigation, withInMemoryScrolling,} from '@angular/router';
import {RxActionFactory} from '@rx-angular/state/actions';
import {ROUTES} from './routes';
import {withGobalStateInitializer} from './state/state-app-initializer.provider';
import {provideTmdbImageLoader} from './data-access/images/image-loader';

export const baseAppConfig: ApplicationConfig = {
  providers: [
    provideTmdbImageLoader(),
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
    RxActionFactory,
    /**
     * **🚀 Perf Tip for LCP, TTI:**
     *
     * Fetch data visible in viewport on app bootstrap instead of component initialization.
     */
    withGobalStateInitializer(),
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Chunk app bootstrap over APP_INITIALIZER.
     */
    {
      provide: APP_INITIALIZER,
      useFactory: () => (): Promise<void> =>
        new Promise<void>((resolve) => {
          setTimeout(() => resolve());
        }),
      deps: [],
      multi: true,
    }
  ],
};
