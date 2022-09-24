import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'my-lists',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/account-feature/account-list-page/account-list-page.component'
      ).then((c) => c.AccountListPageComponent),
  },
  {
    path: 'list/create',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.component'
      ).then((c) => c.ListCreateEditPageComponent),
  },
  {
    path: 'list/detail/:id',
    loadChildren: () =>
      import(
        'projects/movies/src/app/pages/account-feature/list-detail-page/list-detail-page.routes'
      ).then((c) => c.ROUTES),
  },
];
