import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { SERVICE_WORKER_IMPORTS } from './shared/pwa/service-worker.imports';

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
  SERVICE_WORKER_IMPORTS,
];
