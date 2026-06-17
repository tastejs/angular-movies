import { Routes } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withRequestsMadeViaParent,
  withXhr,
} from '@angular/common/http';
import { tmdbReadAccessInterceptor } from '../../auth/tmdb-http-interceptor.feature';

const ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideHttpClient(
        withXhr(),
        withRequestsMadeViaParent(),
        withInterceptors([tmdbReadAccessInterceptor]),
      ),
    ],
    children: [
      {
        path: 'my-lists',
        loadComponent: () =>
          import('./account-list-page/account-list-page.component'),
      },
      {
        path: 'list/create',
        loadComponent: () =>
          import('./list-create-page/list-create-page.component'),
      },
      {
        path: 'list/detail/:id',
        loadChildren: () =>
          import('./list-detail-page/list-detail-page.routes'),
      },
    ],
  },
];

export default ROUTES;
