import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
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
