import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MoviesComponent } from './movies.component';
import { MovieListModule } from '../movie-list/movie-list.module';
import { PaginationModule } from '../../shared/component/pagination/pagination.module';
import { ShareModalModule } from '../../shared/component/share-modal/share-modal.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [MoviesComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MovieListModule,
    PaginationModule,
    ShareModalModule,
    LazyLoadImageModule,
  ],
  exports: [MoviesComponent],
})
export class MoviesModule {}
