import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { ROUTING_IMPORTS } from './app.routing';
import { TMDB_HTTP_INTERCEPTORS_PROVIDER } from './shared/auth/tmdb-http-interceptor.providers';
import { GLOBAL_STATE_APP_INITIALIZER_PROVIDER } from './state-app-initializer.provider';
import { SCHEDULED_APP_INITIALIZER_PROVIDER } from './shared/app-initializer/chunk-app-initializer.provider';
import { SERVICE_WORKER_IMPORTS } from './shared/pwa/service-worker.imports';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';
import { LetModule } from '@rx-angular/template/let';
import { RxActionFactory } from './shared/rxa-custom/actions';
import { FAST_ICON_PROVIDERS } from './ui/component/icons/movie.icon.provider';
import { FastIconModule } from './shared/fast-icon/fast-icon.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
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
    AppShellModule,
    LetModule,
    ROUTING_IMPORTS,
    FastIconModule.forClient(),
  ],
  providers: [
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
    SCHEDULED_APP_INITIALIZER_PROVIDER,
    /**
     * **🚀 Perf Tip for TBT, LCP, CLS:**
     *
     * Configure RxAngular to get maximum performance.
     */
    RXA_PROVIDER,
    FAST_ICON_PROVIDERS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
