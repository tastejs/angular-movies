import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Injectable, NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {StorageService} from './shared/service/storage/storage.service';
import {AppComponent} from './app.component';
import {AppShellModule} from './app-shell/app-shell.module';
import {MoviesRoutedModule} from './movies/container/movies.routed.module';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: {enable: false},
    rotate: {enable: false}
  } as any;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    MoviesRoutedModule,
    AppShellModule
  ],
  providers: [
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
