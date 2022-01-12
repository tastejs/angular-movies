import { RouterModule, Routes } from '@angular/router';
import { MovieListPageComponent } from './pages/movie-list-page/movie-list-page.component';
import { MovieListPageModule } from './pages/movie-list-page/movie-list-page.module';

const ROUTES: Routes = [
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
    /* loadChildren: () =>
      import('projects/movies/src/app/pages/movie-list-page/movie-list-page.module').then((m) => m.MovieListPageModule)
    */
  },
  {
    path: 'detail/movie/:identifier',
    loadChildren: () =>
      import(
        'projects/movies/src/app/pages/movie-detail-page/movie-detail-page.module'
      ).then((m) => m.MovieDetailPageModule),
  },
  {
    path: 'detail/person/:identifier',
    loadChildren: () =>
      import(
        'projects/movies/src/app/pages/person-detail-page/person-detail-page.module'
      ).then((m) => m.PersonDetailPageModule),
  },
  //      static params for 'list/:type/:identifier'
  { path: '**', redirectTo: 'list/category/popular' },
];

export const ROUTING_IMPORTS = [
  MovieListPageModule,
  RouterModule.forRoot(ROUTES, {
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Disable initial sync navigation in router config and schedule it in router-outlet container component
     */
    initialNavigation: 'disabled'
  }),
];
