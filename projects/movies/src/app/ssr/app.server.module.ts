import { NgModule } from '@angular/core';
import { APP_SERVER_PROVIDERS } from './app.server.provider';
import { APP_SERVER_IMPORTS } from './app.server.imports';
import { APP_COMPONENT_IMPORTS, AppComponent } from '../app.component';
import { RXA_PROVIDER_SSR } from '../shared/rxa-custom/rxa.provider.ssr';
import { NgxIsrModule } from 'ngx-isr';

@NgModule({
  declarations: [AppComponent],
  imports: [
    APP_SERVER_IMPORTS,
    APP_COMPONENT_IMPORTS,
    NgxIsrModule.forRoot(),
  ],
  providers: [APP_SERVER_PROVIDERS, RXA_PROVIDER_SSR],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
