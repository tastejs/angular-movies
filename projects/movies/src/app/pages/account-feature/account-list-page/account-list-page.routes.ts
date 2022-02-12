import { Routes } from '@angular/router';
import { AccountListPageComponent } from './account-list-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: AccountListPageComponent,
    children: [
      {
        path: 'list/create',
        loadChildren: () =>
          import(
            'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.module'
          ).then((m) => m.ListCreatePageModule),
      },
      {
        path: 'my-lists',
        loadChildren: () =>
          import(
            'projects/movies/src/app/pages/account-feature/account-list-page/account-list-page.module'
          ).then((m) => m.AccountListPageModule),
      },
    ],
  },
];
