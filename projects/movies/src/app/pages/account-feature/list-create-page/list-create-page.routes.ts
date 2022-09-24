import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'list/create',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.component'
      ).then((c) => c.ListCreateEditPageComponent),
  },
];
