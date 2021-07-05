import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppShellComponent} from './app-shell.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {SettingsModule} from '../settings/settings.module';

@NgModule({
  declarations: [
    AppShellComponent
  ],
  imports: [
    CommonModule,
    SettingsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    AppShellComponent
  ]
})
export class AppShellModule {
}
