import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list.component';
import { StarRatingModule } from '../../shared/component/star-rating/star-rating.module';
import { LetModule } from '@rx-angular/template';
import { AspectRatioBoxModule } from '../../shared/component/aspect-ratio-box/aspect-ratio-box.module';

@NgModule({
  declarations: [MovieListComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    StarRatingModule,
    RouterModule,
    LetModule,
    AspectRatioBoxModule,
  ],
  exports: [MovieListComponent],
})
export class MovieListModule {}
