import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { LoaderComponentModule } from '../../shared/component/loader/loader.component';
import { MovieComponent } from './movie.component';
import { MatMenuModule } from '@angular/material/menu';
import { StarRatingModule } from '../../shared/component/star-rating/star-rating.module';
import { MovieListModule } from '../movie-list/movie-list.module';
import { AspectRatioBoxModule } from '../../shared/component/aspect-ratio-box/aspect-ratio-box.module';

const ROUTES: Routes = [
  {
    path: '',
    component: MovieComponent,
  },
];

@NgModule({
  declarations: [MovieComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MatMenuModule,
    MatDialogModule,
    StarRatingModule,
    MovieListModule,
    LetModule,
    LoaderComponentModule,
    AspectRatioBoxModule,
  ],
  exports: [MovieComponent],
})
export class MovieModule {}
