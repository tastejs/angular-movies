import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovieListModule } from '../../../../ui/pattern/movie-list/movie-list.module';
import { ListMoviesComponent } from './list-movies.component';

const ROUTES = [
  {
    path: '',
    component: ListMoviesComponent,
  },
];

@NgModule({
  imports: [MovieListModule, RouterModule.forChild(ROUTES)],
  declarations: [ListMoviesComponent],
})
export class ListMoviesComponentModule {}
