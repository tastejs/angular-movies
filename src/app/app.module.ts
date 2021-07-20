import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { StorageService } from './shared/service/storage/storage.service';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { MoviesRoutedModule } from './movies/container/movies.routed.module';
import { httpInterceptorProviders } from './shared/service/tmdb/http-interceptor.providers';
import {StarRatingModule} from './shared/component/star-rating/star-rating.module';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false },
  } as any;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
    MoviesRoutedModule,
    AppShellModule,
    AppRoutingModule,
    StarRatingModule
  ],
  providers: [
    httpInterceptorProviders,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
    StorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
