import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { LoaderModule } from '../../ui/component/loader/loader.module';
import { MovieDetailPageComponent } from './movie-detail-page.component';
import { StarRatingModule } from '../../ui/pattern/star-rating/star-rating.module';
import { MovieListModule } from '../../ui/pattern/movie-list/movie-list.module';
import { DetailGridModule } from '../../ui/component/detail-grid/detail-grid.module';

const ROUTES: Routes = [
  {
    path: '',
    component: MovieDetailPageComponent
  }
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
    LoaderModule
  ],
  exports: [MovieDetailPageComponent]
})
export class MovieDetailPageModule {
}
