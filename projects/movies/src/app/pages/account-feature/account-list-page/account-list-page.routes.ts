import { Routes } from '@angular/router';
import { AccountListPageComponent } from './account-list-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my-lists',
  },
  {
    path: 'list/create',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.component'
      ).then((c) => c.ListCreateEditPageComponent),
  },
  {
    path: 'my-lists',
    component: AccountListPageComponent,
  },
];
