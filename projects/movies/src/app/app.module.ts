import {RouterOutlet} from '@angular/router';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RxLet} from '@rx-angular/template/let';
import {AppComponent} from "./app.component";
import {AppShellComponent} from "./app-shell/app-shell.component";
import {appConfig} from "./app.config";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterOutlet, AppShellComponent, RxLet],
  providers: [...appConfig().providers],
  bootstrap: [AppComponent],
})
export class AppModule {
}
