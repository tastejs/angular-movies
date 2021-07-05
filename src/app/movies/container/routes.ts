import {Routes} from '@angular/router';
import {MoviesComponent} from './movies.component';
import {MovieComponent} from '../movie/movie.component';

export const ROUTES: Routes = [
  { path: 'movies/:category', component: MoviesComponent, runGuardsAndResolvers: 'always' },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'genre', component: MoviesComponent, runGuardsAndResolvers: 'always' }
];
