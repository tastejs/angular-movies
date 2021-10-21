import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HamburgerButtonModule } from '../ui/atoms/hamburger-button/hamburger-button.component';
import { SearchBarComponentModule } from '../ui/atoms/search-bar/search-bar.component';
import { SideDrawerComponentModule } from '../ui/atoms/side-drawer/side-drawer.component';
import { AppShellComponent } from './app-shell.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template/let';
import { DarkModeToggleModule } from '../ui/atoms/dark-mode-toggle/dark-mode-toggle.module';
import { RxForModule } from '../ui/atoms/rx-for/rx-for.module';

@NgModule({
  declarations: [AppShellComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HamburgerButtonModule,
    LetModule,
    SideDrawerComponentModule,
    SearchBarComponentModule,
    DarkModeToggleModule,
    RxForModule,
  ],
  exports: [AppShellComponent],
})
export class AppShellModule {}
