import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { LoaderComponentModule } from '../../ui/atoms/loader/loader.component';
import { MovieDetailPageComponent } from './movie-detail-page.component';
import { StarRatingModule } from '../../ui/atoms/star-rating/star-rating.module';
import { AspectRatioBoxModule } from '../../ui/atoms/aspect-ratio-box/aspect-ratio-box.module';
import { MovieListModule } from '../../ui/components/movie-list/movie-list.module';

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
    RouterModule.forChild(ROUTES),
    StarRatingModule,
    MovieListModule,
    LetModule,
    LoaderComponentModule,
    AspectRatioBoxModule,
  ],
  exports: [MovieDetailPageComponent],
})
export class MovieDetailPageModule {}
