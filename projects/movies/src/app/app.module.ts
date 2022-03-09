import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { ROUTING_IMPORTS } from './app.routing';
import { TMDB_HTTP_INTERCEPTORS_PROVIDER } from './shared/auth/tmdb-http-interceptor.providers';
import { GLOBAL_STATE_APP_INITIALIZER_PROVIDER } from './state-app-initializer.provider';
import { SCHEDULED_APP_INITIALIZER_PROVIDER } from './shared/app-initializer/chunk-app-initializer.provider';
import { SERVICE_WORKER_IMPORTS } from './shared/pwa/service-worker.imports';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';
import { LetModule } from '@rx-angular/template/let';
import { RootInjectorShortcutModule } from './shared/injector/root-injector.module';
import { RxActionFactory } from './shared/rxa-custom/actions';

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
    /**
     * **🚀 Perf Tip for TBT, LCP:**
     *
     * Save 0.6KB plus scripting time for every service class wrapper by accessing injectors directly.
     *
     * ⚠ Notice:
     * You have to import this module in the root module of your application to initialize the "hack"
     */
    RootInjectorShortcutModule,
    AppShellModule,
    LetModule,
    ROUTING_IMPORTS,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
