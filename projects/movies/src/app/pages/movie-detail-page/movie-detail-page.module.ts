import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { SvgIconModule } from '../../ui/component/icons/icon.module';
import { MovieDetailPageComponent } from './movie-detail-page.component';
import { StarRatingModule } from '../../ui/pattern/star-rating/star-rating.module';
import { MovieListModule } from '../../ui/pattern/movie-list/movie-list.module';
import { DetailGridModule } from '../../ui/component/detail-grid/detail-grid.module';
import { BypassSrcModule } from '../../shared/bypass-src/bypass-src.module';
import { ForModule } from '@rx-angular/template/experimental/for';

const ROUTES: Routes = [
  {
    path: '',
    component: MovieDetailPageComponent,
  },
];

@NgModule({
  declarations: [MovieDetailPageComponent],
  imports: [
    CommonModule,
    DetailGridModule,
    RouterModule.forChild(ROUTES),
    StarRatingModule,
    MovieListModule,
    LetModule,
    BypassSrcModule,
    ForModule,
    SvgIconModule,
  ],
  exports: [MovieDetailPageComponent],
})
export class MovieDetailPageModule {}
