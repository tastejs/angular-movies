import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import {ServiceWorkerModule} from "@angular/service-worker";
import {environment} from "../environments/environment";

export const APP_IMPORTS = [
  FastSvgModule.forRoot({
    url: (name: string): string => {
      return `assets/svg-icons/${name}.svg`;
    },
  }),
  BrowserModule.withServerTransition({ appId: 'moviesApp' }),
  HttpClientModule,
  /**
   * **🚀 Perf Tip for LCP, CLS:**
   *
   * Data from HTTP requests performed at SSR are transferred to FE & reused to avoid over-fetching and blink on app bootstrap.
   */
  TransferHttpCacheModule,

  /**
   * **🚀 Perf Tip for UX:**
   *
   * Setup serviceworker to get caching for HTTP requests and assets as well as better offline experience.
   */
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
    // Register the ServiceWorker as soon as the app is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  })
];
