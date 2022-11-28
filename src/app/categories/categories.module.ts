import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { CategoriesAddModalComponent } from './categories-add-modal/categories-add-modal.component';
import { CategoriesDeleteModalComponent } from './categories-delete-modal/categories-delete-modal.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule
  ],
  declarations: [
    CategoriesComponent,
    CategoriesAddModalComponent,
    CategoriesDeleteModalComponent
  ],
  entryComponents: [
    CategoriesAddModalComponent,
    CategoriesDeleteModalComponent
  ]
})
export class CategoriesModule { }
