import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withDisabledInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { RxActionFactory } from '@rx-angular/state/actions';
import { ROUTES } from './routes';
import { withGobalStateInitializer } from './state/state-app-initializer.provider';
import { provideClientHydration } from '@angular/platform-browser';

const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
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
    // global actions
    RxActionFactory,
    /**
     * **🚀 Perf Tip for LCP, TTI:**
     *
     * Fetch data visible in viewport on app bootstrap instead of component initialization.
     */
    withGobalStateInitializer(),
  ],
};

export function mergeBaseConfig(...configs: ApplicationConfig[]) {
  return mergeApplicationConfig(appConfig, ...configs);
}
