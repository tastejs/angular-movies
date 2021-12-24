import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list.component';
import { StarRatingModule } from '../../component/star-rating/star-rating.module';
import { LetModule } from '@rx-angular/template/let';
import { AspectRatioBoxModule } from '../../component/aspect-ratio-box/aspect-ratio-box.module';
import { RxForModule } from '../../../shared/rxa-custom/rx-for/rx-for.module';

@NgModule({
  declarations: [MovieListComponent],
  imports: [
    CommonModule,
    RouterModule,
    StarRatingModule,
    LetModule,
    AspectRatioBoxModule,
    RxForModule
  ],
  exports: [MovieListComponent],
})
export class MovieListModule {}
