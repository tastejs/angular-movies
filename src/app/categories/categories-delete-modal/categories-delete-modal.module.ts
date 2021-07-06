import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CategoriesDeleteModalComponent} from './categories-delete-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  declarations: [
    CategoriesDeleteModalComponent
  ],
  entryComponents: [
    CategoriesDeleteModalComponent
  ],
  exports: [
    CategoriesDeleteModalComponent
  ]
})
export class CategoriesDeleteModalModule {
}
