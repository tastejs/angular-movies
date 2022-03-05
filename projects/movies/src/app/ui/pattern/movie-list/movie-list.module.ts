import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GridListModule } from '../../component/grid-list/grid-list.module';
import { SvgIconModule } from '../../component/icons/icon.module';
import { MovieListComponent } from './movie-list.component';
import { StarRatingModule } from '../star-rating/star-rating.module';
import { LetModule } from '@rx-angular/template/let';
import { ForModule } from '@rx-angular/template/experimental/for';
import { ElementVisibilityModule } from '../../../shared/cdk/element-visibility/element-visibility.module';

@NgModule({
  declarations: [MovieListComponent],
  imports: [
    CommonModule,
    RouterModule,
    StarRatingModule,
    LetModule,
    ForModule,
    ElementVisibilityModule,
    SvgIconModule,
    GridListModule,
  ],
  exports: [MovieListComponent],
})
export class MovieListModule {}
