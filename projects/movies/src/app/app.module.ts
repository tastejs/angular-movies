import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { httpInterceptorProviders } from './data-access/auth/http-interceptor.providers';
import { ROUTING_IMPORTS } from './app.routing';
import { stateAppInitializerProvider } from './shared/state/state-app-initializer.provider';
import { SERVICE_WORKER_IMPORTS } from './service-worker.imports';
import { SSR_IMPORTS } from './ssr.imports';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'movies' }),
    BrowserTransferStateModule,
    /**
     * **🚀 Perf Tip for LCP, CLS:**
     *
     * Setup SSR to increase LCP by shipping rendered HTML on first load.
     */
    SSR_IMPORTS,
    /**
     * **🚀 Perf Tip for UX:**
     *
     * Setup serviceworker to get caching for HTTP requests and assets as well as better offline experience.
     */
    SERVICE_WORKER_IMPORTS,
    HttpClientModule,
    AppShellModule,
    ROUTING_IMPORTS
  ],
  providers: [
    httpInterceptorProviders,
    /**
     * **🚀 Perf Tip for LCP, TTI:**
     *
     * Fetch data visible in viewport on app bootstrap instead of component initialization.
     */
    stateAppInitializerProvider

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
