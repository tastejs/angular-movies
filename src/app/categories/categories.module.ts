import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CategoriesRoutingModule} from './categories-routing.module';
import {CategoriesComponent} from './categories.component';
import {ShareModalModule} from '../shared/component/share-modal/share-modal.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CategoriesAddModalModule} from './categories-add-modal/categories-add-modal.module';
import {CategoriesDeleteModalModule} from './categories-delete-modal/categories-delete-modal.module';

@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ShareModalModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    CategoriesAddModalModule,
    CategoriesDeleteModalModule,
    TranslateModule
  ],
  declarations: [
    CategoriesComponent
  ],
  exports: [
    CategoriesComponent
  ]
})
export class CategoriesModule {
}
