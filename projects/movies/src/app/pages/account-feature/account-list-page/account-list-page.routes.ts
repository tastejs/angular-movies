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
    loadChildren: () =>
      import(
        'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.module'
      ).then((m) => m.ListCreatePageModule),
  },
  {
    path: 'my-lists',
    component: AccountListPageComponent,
  },
];
