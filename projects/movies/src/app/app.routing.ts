import { RouterModule, Routes } from '@angular/router';

const getMovieListPageModuleImport = () => import('projects/movies/src/app/pages/movie-list-page/movie-list-page.module').then((m) => m.MovieListPageModule);

const ROUTES: Routes = [
  /*
   @TODO add perf tip for 1 param 2 routes vs 2 params 1 route
    {
      path: 'category/:category',
      loadChildren: getMovieListPageModuleImport
    },
    {
      path: 'genre/:genre',
      loadChildren: getMovieListPageModuleImport
    }
   */
  {
    path: 'list/:type/:identifier',
    loadChildren: getMovieListPageModuleImport
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('projects/movies/src/app/pages/movie-detail-page/movie-detail-page.module').then((m) => m.MovieDetailPageModule)
  },
  { path: '**', redirectTo: 'list/category/popular' }
];

export const ROUTING_IMPORTS = [
  RouterModule.forRoot(ROUTES, {
    initialNavigation: 'enabled',
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy'
  })
];
