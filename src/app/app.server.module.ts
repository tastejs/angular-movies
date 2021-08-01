import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { RX_ANGULAR_CONFIG } from '@rx-angular/cdk';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UniversalInterceptor } from './shared/service/tmdb/universal.interceptor';

@NgModule({
  imports: [AppModule, ServerModule, TransferHttpCacheModule],
  providers: [
    {
      provide: RX_ANGULAR_CONFIG,
      useValue: {
        primaryStrategy: 'native',
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
