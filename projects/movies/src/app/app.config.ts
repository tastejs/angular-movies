import { APP_INITIALIZER, ApplicationConfig, NgZone, ɵprovideZonelessChangeDetection as provideZonelessChangeDetection } from '@angular/core';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { tmdbContentTypeInterceptor } from './data-access/api/tmdbContentTypeInterceptor';
import { tmdbReadAccessInterceptor } from './auth/tmdb-http-interceptor.feature';
import { CustomNgZone } from './shared/zone-less/custom-zone';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { provideTmdbImageLoader } from './data-access/images/image-loader';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideRouter,
  withDisabledInitialNavigation,
  withInMemoryScrolling, withViewTransitions
} from '@angular/router';
import { ROUTES } from './routes';
import { withGobalStateInitializer } from './state/state-app-initializer.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),

    provideHttpClient(
      withFetch(),
      withInterceptors([tmdbContentTypeInterceptor, tmdbReadAccessInterceptor])
    ),

    provideRouter(
      ROUTES,
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
      }),
      withViewTransitions()
    ),
    /**
     * **🚀 Perf Tip for LCP, TTI:**
     *
     * Fetch data visible in viewport on app bootstrap instead of component initialization.
     */
    withGobalStateInitializer(),

    provideTmdbImageLoader(),

    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
    }),
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
      multi: true,
    },
    /**
     * **🚀 Perf Tip for TBT, LCP, CLS:**
     *
     * Configure RxAngular to get maximum performance.
     */
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: { patchZone: false },
    },

    /*needed to fix zone-less hydration*/
    {
      provide: NgZone,
      useClass: CustomNgZone,
    },

    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),

    provideZonelessChangeDetection(),
  ],
};
