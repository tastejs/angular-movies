import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { StorageService } from './shared/service/storage/storage.service';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { httpInterceptorProviders } from './shared/service/tmdb/http-interceptor.providers';
import { StarRatingModule } from './shared/component/star-rating/star-rating.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'hub-movies' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppShellModule,
    AppRoutingModule,
    StarRatingModule,
  ],
  providers: [httpInterceptorProviders, StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
