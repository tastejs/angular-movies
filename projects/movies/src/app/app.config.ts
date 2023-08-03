import { APP_INITIALIZER, ApplicationConfig, NgZone } from '@angular/core';
import { mergeBaseConfig } from './app.base.config';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { tmdbContentTypeInterceptor } from './data-access/api/tmdbContentTypeInterceptor';
import { tmdbReadAccessInterceptor } from './auth/tmdb-http-interceptor.feature';
import { CustomNgZone } from './shared/zone-less/custom-zone';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { provideTmdbImageLoader } from './data-access/images/image-loader';

const browserConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([tmdbContentTypeInterceptor, tmdbReadAccessInterceptor])
    ),
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
  ],
};
// We provide the config function as closure to be able to inject configuration from the consuming end
export const appConfig = () => mergeBaseConfig(browserConfig);
