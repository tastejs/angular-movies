import { NgModule } from '@angular/core';
import { RXA_PROVIDER_SSR } from './shared/rxa-custom/rxa.provider.ssr';
import { APP_PROVIDERS } from './app.provider';
import { APP_SERVER_PROVIDERS } from './app.server.provider';
import { AppServerComponent } from './app.server.component';
import { RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { LetModule } from '@rx-angular/template/let';

@NgModule({
  declarations: [AppServerComponent],
  imports: [RouterModule, AppShellComponent, LetModule],
  providers: [APP_PROVIDERS, APP_SERVER_PROVIDERS, RXA_PROVIDER_SSR],
  bootstrap: [AppServerComponent],
})
export class AppServerModule {}
