import { NgModule } from '@angular/core';
import { RXA_PROVIDER_SSR } from '../shared/rxa-custom/rxa.provider.ssr';
import { APP_PROVIDERS } from '../app.provider';
import { APP_IMPORTS } from '../app.imports';
import { APP_SERVER_PROVIDERS } from './app.server.provider';
import { APP_SERVER_IMPORTS } from './app.server.imports';
import { AppComponent, APP_COMPONENT_IMPORTS } from '../app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [APP_IMPORTS, APP_SERVER_IMPORTS, APP_COMPONENT_IMPORTS],
  providers: [APP_PROVIDERS, APP_SERVER_PROVIDERS, RXA_PROVIDER_SSR],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
