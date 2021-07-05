import {NgModule} from '@angular/core';
import {MovieModule} from '../movie/movie.module';
import {RouterModule} from '@angular/router';
import {ROUTES} from './routes';
import {MoviesModule} from './movies.module';


@NgModule({
  imports: [
    MovieModule,
    MoviesModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    MovieModule,
    MoviesModule
  ]
})
export class MoviesRoutedModule { }
