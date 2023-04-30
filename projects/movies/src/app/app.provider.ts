import { withGobalStateInitializer } from './state/state-app-initializer.provider';
import {
  provideRouter,
  withDisabledInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { ROUTES } from './app.routing';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { APP_ID, APP_INITIALIZER } from '@angular/core';
import { provideTmdbImageLoader } from './data-access/images/image-loader';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tmdbContentTypeInterceptor } from './data-access/api/tmdbContentTypeInterceptor';
import { tmdbReadAccessInterceptor } from './auth/tmdb-http-interceptor.feature';

export const APP_PROVIDERS = [
  {
    provide: APP_ID,
    useValue: 'moviesApp',
  },
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
  provideHttpClient(
    withInterceptors([tmdbContentTypeInterceptor, tmdbReadAccessInterceptor])
  ),
  provideClientHydration(),
  provideTmdbImageLoader(),
  provideFastSVG({
    url: (name: string): string => `assets/svg-icons/${name}.svg`,
  }),
];
