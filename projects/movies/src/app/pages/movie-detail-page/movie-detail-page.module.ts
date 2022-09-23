import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailPageComponent } from './movie-detail-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MovieDetailPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(ROUTES), MovieDetailPageComponent],
  exports: [MovieDetailPageComponent],
})
export class MovieDetailPageModule {}
