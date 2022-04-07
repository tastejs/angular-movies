import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IfModule } from '../../../shared/rxa-custom/if/src/index';
import { GridListModule } from '../../component/grid-list/grid-list.module';
import { FastIconModule } from '../../../shared/fast-icon/fast-icon.module';
import { MovieListComponent } from './movie-list.component';
import { StarRatingModule } from '../star-rating/star-rating.module';
import { ForModule } from '@rx-angular/template/experimental/for';
import { ElementVisibilityModule } from '../../../shared/cdk/element-visibility/element-visibility.module';

@NgModule({
  declarations: [MovieListComponent],
  imports: [
    CommonModule,
    RouterModule,
    StarRatingModule,
    ForModule,
    ElementVisibilityModule,
    FastIconModule,
    GridListModule,
    IfModule,
  ],
  exports: [MovieListComponent],
})
export class MovieListModule {}
