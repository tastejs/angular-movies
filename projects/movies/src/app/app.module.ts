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
    BrowserModule.withServerTransition({ appId: 'hub-movies' }),
    BrowserTransferStateModule,
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
    stateAppInitializerProvider,
    {
      provide: RX_ANGULAR_CONFIG,
      useValue: {
        customStrategies: customStrategyCredentials,
        patchZone: false
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
