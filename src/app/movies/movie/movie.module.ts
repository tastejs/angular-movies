import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie.component';
import { MovieTrailerModule } from './movie-trailer/movie-trailer.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { StarRatingModule } from '../../shared/component/star-rating/star-rating.module';
import { MovieListModule } from '../movie-list/movie-list.module';

@NgModule({
  declarations: [MovieComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MovieTrailerModule,
    StarRatingModule,
    MovieListModule,
  ],
  exports: [MovieComponent],
})
export class MovieModule {}
