import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { StarRatingModule } from '../../shared/component/star-rating/star-rating.module';

@NgModule({
  declarations: [MovieListComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    LazyLoadImageModule,
    StarRatingModule,
    RouterModule,
  ],
  exports: [MovieListComponent],
})
export class MovieListModule {}
