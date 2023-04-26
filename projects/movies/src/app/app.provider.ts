import { RxActionFactory } from '@rx-angular/state/actions';
import { TMDB_HTTP_INTERCEPTORS_PROVIDER } from './auth/tmdb-http-interceptor.providers';
import { GLOBAL_STATE_APP_INITIALIZER_PROVIDER } from './state/state-app-initializer.provider';
import {
  provideRouter,
  withDisabledInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import {provideClientHydration} from '@angular/platform-browser';
import { ROUTES } from './app.routing';
import {RX_RENDER_STRATEGIES_CONFIG} from "@rx-angular/cdk/render-strategies";
import {APP_INITIALIZER} from "@angular/core";
import {provideMovieDbImageLoader} from "./data-access/images/image-loader";

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
  },
  /**
   * **🚀 Perf Tip for TBT, LCP, CLS:**
   *
   * Configure RxAngular to get maximum performance.
   */
  {
    provide: RX_RENDER_STRATEGIES_CONFIG,
    useValue: {
      /**
       * **🚀 Perf Tip for TTI:**
       *
       * Configure RxAngular's default behaviour to avoid any additional zone-logic to run.
       * This could en up in missing view updates for template projection, but can be applied by directive to fix it granulary.
       */
      patchZone: false,
    },
  },

  /**
   *
   */
  provideClientHydration(),
  provideMovieDbImageLoader()
];
