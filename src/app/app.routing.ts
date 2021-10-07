import { RouterModule, Routes } from '@angular/router';

const getMovieListPageModuleImport = () => import('app/pages/movie-list-page/movie-list-page.module').then((m) => m.MovieListPageModule);

const ROUTES: Routes = [
  {
    path: 'list/:type/:identifier',
    loadChildren: getMovieListPageModuleImport
  },
  /*{
    path: 'category/:category',
    loadChildren: getMovieListPageModuleImport
  },
  {
    path: 'genre/:genre',
    loadChildren: getMovieListPageModuleImport
  },*/
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('app/pages/movie-detail-page/movie-detail-page.module').then((m) => m.MovieDetailPageModule)
  },
 // { path: '**', redirectTo: 'list/category/popular' }
];

export const ROUTING_IMPORTS = [
  RouterModule.forRoot(ROUTES, {
    initialNavigation: 'enabled',
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy'
  })
];
