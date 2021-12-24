import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { RxForModule } from '../shared/rxa-custom/rx-for/rx-for.module';
import { HamburgerButtonModule } from '../ui/component/hamburger-button/hamburger-button.component';
import { SideDrawerComponentModule } from '../ui/component/side-drawer/side-drawer.component';
import { DarkModeToggleModule } from '../ui/component/dark-mode-toggle/dark-mode-toggle.module';
import { SearchBarModule } from '../ui/component/search-bar/search-bar.module';
import { AppShellComponent } from './app-shell.component';

@NgModule({
  declarations: [AppShellComponent],
  imports: [
    CommonModule,
    RouterModule,
    HamburgerButtonModule,
    LetModule,
    SideDrawerComponentModule,
    SearchBarModule,
    DarkModeToggleModule,
    RxForModule
  ],
  exports: [AppShellComponent]
})
export class AppShellModule {
}
