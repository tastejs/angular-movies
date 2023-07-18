import {Routes} from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../list-detail-page/list-detail-page.component'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'view',
      },
      {
        path: 'view',
        loadComponent: () => import('./list-movies/list-movies.component'),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('../list-create-page/list-create-page.component'),
      },
      {
        path: 'add-remove-items',
        loadComponent: () =>
          import('./list-items-edit/list-items-edit.component'),
      },
      {
        path: 'image',
        loadComponent: () => import('./list-image/list-image.component'),
      },
      {
        path: 'delete',
        loadComponent: () => import('./list-remove/list-remove.component'),
      },
    ],
  },
];

export default ROUTES;
