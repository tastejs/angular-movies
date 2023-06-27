import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import {baseAppConfig} from './app.base.config';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideClientHydration} from "@angular/platform-browser";
import {RX_RENDER_STRATEGIES_CONFIG} from "@rx-angular/cdk/render-strategies";
import {tmdbContentTypeInterceptor} from "./data-access/api/tmdbContentTypeInterceptor";
import {tmdbReadAccessInterceptor} from "./auth/tmdb-http-interceptor.feature";

const browserConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([tmdbContentTypeInterceptor, tmdbReadAccessInterceptor])
    ),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
    }),
    /**
     * **🚀 Perf Tip for TBT, LCP, CLS:**
     *
     * Configure RxAngular to get maximum performance.
     */
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: {patchZone: false},
    }
  ],
};

export const appConfig = mergeApplicationConfig(baseAppConfig, browserConfig);
