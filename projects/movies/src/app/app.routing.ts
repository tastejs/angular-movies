import { Routes } from '@angular/router';
import { MovieListPageComponent } from './pages/movie-list-page/movie-list-page.component';

export const ROUTES: Routes = [
  /**
   * **🚀 Perf Tip for TTI, TBT:**
   *
   * If you have routes with the same UI but different data implement it with 2 parameters instead of 2 different routes.
   * This saves creation-time and destruction-time of the component and also render work in the browser.
   *
   * E.g.:
   *
   * _Bad_
   *  {
   *  path: 'list-category/:category',
   *  loadChildren: import('list.module').then((m) => m.ListModule)
   *  },
   *  {
   *  path: 'list-genre/:genre',
   *  loadChildren: import('list.module').then((m) => m.ListModule)
   *  }
   *
   * _Good_
   * {
   *  path: 'list/:type/:identifier',
   *  loadChildren: import('list.module').then((m) => m.ListModule)
   *  }
   *
   */
  {
    path: 'list/:type/:identifier',
    component: MovieListPageComponent,
    /* loadComponent: () =>
      import('projects/movies/src/app/pages/movie-list-page/movie-list-page.component').then((m) => m.MovieListPageComponent)
    */
  },
  {
    path: 'detail/movie/:identifier',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/movie-detail-page/movie-detail-page.component'
      ).then((c) => c.MovieDetailPageComponent),
  },
  {
    path: 'detail/list/:identifier',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/account-feature/list-detail-page/list-detail-page.component'
      ).then((c) => c.ListDetailPageComponent),
  },
  {
    path: 'detail/person/:identifier',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/person-detail-page/person-detail-page.component'
      ).then((c) => c.PersonDetailPageComponent),
  },
  {
    path: 'account',
    loadChildren: () =>
      import(
        'projects/movies/src/app/pages/account-feature/account-featuer-page.routes'
      ).then((c) => c.ROUTES),
  },
  {
    path: 'page-not-found',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/not-found-page/not-found-page.component'
      ).then((c) => c.NotFoundPageComponent),
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];
