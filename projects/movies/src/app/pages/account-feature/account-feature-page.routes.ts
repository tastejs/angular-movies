import { Routes } from '@angular/router';

const ROUTES: Routes = [

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
        )
  }
];

export default ROUTES;
