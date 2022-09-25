import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { PersonDetailPageComponent } from './person-detail-page.component';
import { StarRatingModule } from '../../ui/pattern/star-rating/star-rating.module';
import { MovieListModule } from '../../ui/pattern/movie-list/movie-list.module';
import { DetailGridModule } from '../../ui/component/detail-grid/detail-grid.module';

const ROUTES: Routes = [
  {
    path: '',
    component: PersonDetailPageComponent,
  },
];

@NgModule({
  declarations: [PersonDetailPageComponent],
  imports: [
    CommonModule,
    DetailGridModule,
    RouterModule.forChild(ROUTES),
    StarRatingModule,
    MovieListModule,
    LetModule,
    FastSvgModule,
  ],
  exports: [PersonDetailPageComponent],
})
export class PersonDetailPageModule {}
