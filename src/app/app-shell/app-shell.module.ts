import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HamburgerButtonModule } from '../shared/component/hamburger-button/hamburger-button/hamburger-button.component';
import { SearchBarComponentModule } from '../shared/component/search-bar/search-bar.component';
import { SideDrawerComponentModule } from '../shared/component/side-drawer/side-drawer.component';
import { AppShellComponent } from './app-shell.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template/let';
import { DarkModeToggleModule } from '../shared/component/dark-mode-toggle/dark-mode-toggle.module';

@NgModule({
  declarations: [AppShellComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    HamburgerButtonModule,
    LetModule,
    SideDrawerComponentModule,
    SearchBarComponentModule,
    DarkModeToggleModule,
  ],
  exports: [AppShellComponent],
})
export class AppShellModule {}
