import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {SettingsComponent} from './settings.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    TranslateModule
  ],
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule {
}
