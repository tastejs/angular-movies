import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { ForModule } from '@rx-angular/template/experimental/for';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';
import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { AppShellComponent } from './app-shell.component';
import { LazyDirective } from '../shared/cdk/lazy/lazy.directive';
import { FastIconModule } from '../shared/fast-icon/fast-icon.module';

@NgModule({
  declarations: [AppShellComponent],
  imports: [
    CommonModule,
    RouterModule,
    HamburgerButtonComponent,
    LetModule,
    SideDrawerComponent,
    SearchBarComponent,
    DarkModeToggleComponent,
    ForModule,
    LazyDirective,
    FastIconModule,
  ],
  exports: [AppShellComponent],
  providers: [],
})
export class AppShellModule {}
