import {ApplicationConfig, NgZone} from '@angular/core';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideClientHydration} from "@angular/platform-browser";
import {RX_RENDER_STRATEGIES_CONFIG} from "@rx-angular/cdk/render-strategies";
import {tmdbContentTypeInterceptor} from "./data-access/api/tmdbContentTypeInterceptor";
import {tmdbReadAccessInterceptor} from "./auth/tmdb-http-interceptor.feature";
import {CustomNgZone} from "./shared/zone-less/custom-zone";
import {mergeBaseConfig} from "./app.config";

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
    },
    {
      provide: NgZone,
      useClass: CustomNgZone,
    }
  ],
};

// We provide the config function as closure to be able to inject configuration from the consuming end
export const appConfig = (outerConfig: ApplicationConfig = {} as ApplicationConfig) => mergeBaseConfig(browserConfig, outerConfig);
