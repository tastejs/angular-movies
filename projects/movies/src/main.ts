import {AppComponent} from './app/app.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {appConfig} from './app/app.config.browser';
import {RouterOutlet} from '@angular/router';
import {AppShellComponent} from './app/app-shell/app-shell.component';
import {LetDirective} from '@rx-angular/template/let';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppShellComponent,
    LetDirective
  ],
  providers: [
    ...appConfig().providers
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZone: 'noop' })
  .catch((err) => console.error(err));
