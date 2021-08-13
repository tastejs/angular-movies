import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'about',
    loadChildren: () =>
      import('app/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('app/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('app/movies/movie/movie.module').then((m) => m.MovieModule),
  },
  {
    path: 'movies/:category',
    loadChildren: () =>
      import('app/movies/container/movies.module').then((m) => m.MoviesModule),
  },
  {
    path: 'genre/:genre',
    loadChildren: () =>
      import('app/movies/container/movies.module').then((m) => m.MoviesModule),
  },
  { path: '**', redirectTo: 'movies/popular' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      initialNavigation: 'enabled',
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
