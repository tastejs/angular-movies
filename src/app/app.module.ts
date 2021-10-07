import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RX_ANGULAR_CONFIG } from '@rx-angular/cdk';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { customStrategyCredentials } from './shared/utils/custom-strategies';
import { httpInterceptorProviders } from './data-access/auth/http-interceptor.providers';
import { StateAppInitializerProvider } from './shared/state/state.app-initializer.provider';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'hub-movies' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    HttpClientModule,
    AppShellModule,
    RouterModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    httpInterceptorProviders,
    StateAppInitializerProvider,
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
