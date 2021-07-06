import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {PaginationComponent} from './pagination.component';


@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [PaginationComponent],
})
export class PaginationModule { }
