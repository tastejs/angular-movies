import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { StorageService } from './shared/service/storage/storage.service';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { httpInterceptorProviders } from './shared/service/tmdb/http-interceptor.providers';
import { StarRatingModule } from './shared/component/star-rating/star-rating.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StateService } from './shared/service/state.service';

export function initializeState(state: StateService) {
  return (): Promise<void> => {
    return state.init();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'hub-movies' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    HttpClientModule,
    AppShellModule,
    AppRoutingModule,
    StarRatingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    httpInterceptorProviders,
    StorageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeState,
      deps: [StateService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
