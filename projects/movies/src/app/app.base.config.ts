import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApplicationConfig, mergeApplicationConfig,} from '@angular/core';
import {provideClientHydration} from '@angular/platform-browser';
import {provideRouter, withDisabledInitialNavigation, withInMemoryScrolling,} from '@angular/router';
import {RxActionFactory} from '@rx-angular/state/actions';
import {ROUTES} from './routes';
import {tmdbReadAccessInterceptor} from './auth/tmdb-http-interceptor.feature';
import {tmdbContentTypeInterceptor} from './data-access/api/tmdbContentTypeInterceptor';
import {provideTmdbImageLoader} from './data-access/images/image-loader';
import {withGlobalStateInitializer} from "./state/state-app-initializer.provider";

const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([tmdbContentTypeInterceptor, tmdbReadAccessInterceptor])
    ),
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
    // Global actions
    RxActionFactory,
    /**
     * **🚀 Perf Tip for LCP, TTI:**
     *
     * Fetch data visible in viewport on app bootstrap instead of component initialization.
     */
    withGlobalStateInitializer()
  ],
};

export function mergeBaseConfig(...configs: ApplicationConfig[]) {
  return mergeApplicationConfig(appConfig, ...configs);
}
