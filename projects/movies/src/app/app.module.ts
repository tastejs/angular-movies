import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { HTTP_INTERSEPTERS_PROVIDERS } from './data-access/auth/http-interceptor.providers';
import { ROUTING_IMPORTS } from './app.routing';
import { GLOBAL_STATE_APP_INITIALIZER_PROVIDER } from './shared/state/state.app-initializer.provider';
import { SCHEDULED_APP_INITIALIZER_PROVIDER } from './shared/app-initializer/chunk.app-initializer.provider';
import { SERVICE_WORKER_IMPORTS } from './shared/pwa/service-worker.imports';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    /**
     * **🚀 Perf Tip for UX:**
     *
     * Setup serviceworker to get caching for HTTP requests and assets as well as better offline experience.
     */
    SERVICE_WORKER_IMPORTS,
    AppShellModule,
    ROUTING_IMPORTS
  ],
  providers: [
    HTTP_INTERSEPTERS_PROVIDERS,
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
    SCHEDULED_APP_INITIALIZER_PROVIDER,
    /**
     * **🚀 Perf Tip for TBT, LCP, CLS:**
     *
     * Configure RxAngular to get maximum performance.
     */
    RXA_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
