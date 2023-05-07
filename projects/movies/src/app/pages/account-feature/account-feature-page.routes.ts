import { Routes } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withRequestsMadeViaParent,
} from '@angular/common/http';
import { tmdbReadAccessInterceptor } from '../../auth/tmdb-http-interceptor.feature';

const ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideHttpClient(
        withRequestsMadeViaParent(),
        withInterceptors([tmdbReadAccessInterceptor])
      ),
    ],
    children: [
      {
        path: 'my-lists',
        loadComponent: () =>
          import(
            'projects/movies/src/app/pages/account-feature/account-list-page/account-list-page.component'
          ),
      },
      {
        path: 'list/create',
        loadComponent: () =>
          import(
            'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.component'
          ),
      },
      {
        path: 'list/detail/:id',
        loadChildren: () =>
          import(
            'projects/movies/src/app/pages/account-feature/list-detail-page/list-detail-page.routes'
          ),
      },
    ],
  },
];

export default ROUTES;
