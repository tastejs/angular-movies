import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HamburgerButtonModule } from '../ui/atoms/hamburger-button/hamburger-button.component';
import { SideDrawerComponentModule } from '../ui/atoms/side-drawer/side-drawer.component';
import { AppShellComponent } from './app-shell.component';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { DarkModeToggleModule } from '../ui/atoms/dark-mode-toggle/dark-mode-toggle.module';
import { RxForModule } from '../shared/rxa-custom/rx-for/rx-for.module';
import { SearchBarModule } from '../ui/atoms/search-bar/search-bar.module';

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
