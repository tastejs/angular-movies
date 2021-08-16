import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HamburgerButtonModule } from '../shared/component/hamburger-button/hamburger-button/hamburger-button.component';
import { SideDrawerComponentModule } from '../shared/component/side-drawer/side-drawer.component';
import { AppShellComponent } from './app-shell.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { LetModule } from '@rx-angular/template/let';
import { DarkModeToggleModule } from '../shared/component/dark-mode-toggle/dark-mode-toggle.module';

@NgModule({
  declarations: [AppShellComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    HamburgerButtonModule,
    LetModule,
    SideDrawerComponentModule,
    DarkModeToggleModule,
  ],
  exports: [AppShellComponent],
})
export class AppShellModule {}
