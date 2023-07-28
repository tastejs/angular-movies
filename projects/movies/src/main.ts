import {AppComponent} from './app/app.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {appConfig} from './app/app.config';
import {RouterOutlet} from '@angular/router';
import {AppShellComponent} from './app/app-shell/app-shell.component';
import {RxLet} from '@rx-angular/template/let';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterOutlet, AppShellComponent, RxLet],
  providers: [...appConfig.providers],
  bootstrap: [AppComponent],
})
export class AppModule {
}

/**
 * We have to use `platformBrowserDynamic` until Angular allows to run `bootstrapApplication` in zone-less mode
 */
platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZone: 'noop' })
  .catch((err) => console.error(err));
