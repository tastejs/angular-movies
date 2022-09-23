import { NgModule } from '@angular/core';
import { MovieListPageComponent } from './movie-list-page.component';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    component: MovieListPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(ROUTES), MovieListPageComponent],
  exports: [MovieListPageComponent],
})
export class MovieListPageModule {}
