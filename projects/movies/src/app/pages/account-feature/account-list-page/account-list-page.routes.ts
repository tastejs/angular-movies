import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'my-lists',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/account-feature/account-list-page/account-list-page.component'
      ).then((c) => c.AccountListPageComponent),
  },
];
