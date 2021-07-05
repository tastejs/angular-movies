import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MoviesComponent} from './movies.component';
import {MovieListModule} from '../movie-list/movie-list.module';
import {PaginationModule} from '../../shared/component/pagination/pagination.module';


@NgModule({
  declarations: [
    MoviesComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MovieListModule,
    PaginationModule
  ],
  exports: [
    MoviesComponent
  ]
})
export class MoviesModule {
}
