import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MovieTrailerComponent} from './movie-trailer.component';


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
