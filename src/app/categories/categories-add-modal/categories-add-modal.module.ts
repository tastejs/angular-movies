import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CategoriesRoutingModule} from '../categories-routing.module';
import {CategoriesAddModalComponent} from './categories-add-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CategoriesRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  declarations: [
    CategoriesAddModalComponent
  ],
  entryComponents: [
    CategoriesAddModalComponent
  ],
  exports: [
    CategoriesAddModalComponent
  ]
})
export class CategoriesAddModalModule {
}
