import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MovieTrailerComponent} from './movie-trailer.component';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [
    MovieTrailerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MovieTrailerComponent
  ]
})
export class MovieTrailerModule { }
