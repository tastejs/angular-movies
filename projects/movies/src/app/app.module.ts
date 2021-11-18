import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RX_ANGULAR_CONFIG } from '@rx-angular/cdk';
import { environment } from '../environments/environment';

import { ROUTING_IMPORTS } from './app.routing';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { customStrategyCredentials } from './shared/utils/custom-strategies';
import { httpInterceptorProviders } from './data-access/auth/http-interceptor.providers';
import { stateAppInitializerProvider } from './shared/state/state-app-initializer.provider';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'movies' }),
    BrowserTransferStateModule,
    /**
     * **🚀 Perf Tip for LCP, CLS:**
     *
     * Fetch data on while SSR and reuse this data directly in the app to avoid overfetchung.
     */
    TransferHttpCacheModule,
    HttpClientModule,
    AppShellModule,
    ROUTING_IMPORTS,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    httpInterceptorProviders,
    /**
     * **🚀 Perf Tip for LCP, TTI:**
     *
     * Fetch data visible in viewport on app bootstrap instead of component initialization.
     */
    stateAppInitializerProvider,
    {
      provide: RX_ANGULAR_CONFIG,
      useValue: {
        customStrategies: customStrategyCredentials,
        /**
         * **🚀 Perf Tip for TTI:**
         *
         * Configure RxAngular's default behaviour to avoid any additional zone-logic to run.
         * This could en up in missing view updates for template projection, but can be applied by directive to fix it granulary.
         */
        patchZone: false
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
