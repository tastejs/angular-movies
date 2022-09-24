import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        'projects/movies/src/app/pages/account-feature/list-detail-page/list-detail-page.component'
      ).then((c) => c.ListDetailPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'view',
      },
      {
        path: 'view',
        loadComponent: () =>
          import('./list-movies/list-movies.component').then(
            (m) => m.ListMoviesComponent
          ),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import(
            'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.component'
          ).then((m) => m.ListCreateEditPageComponent),
      },
      {
        path: 'add-remove-items',
        loadComponent: () =>
          import('./list-items-edit/list-items-edit.component').then(
            (m) => m.ListItemsEditComponent
          ),
      },
      {
        path: 'image',
        loadComponent: () =>
          import('./list-image/list-image.component').then(
            (m) => m.ListImageComponent
          ),
      },
      {
        path: 'delete',
        loadComponent: () =>
          import('./list-remove/list-remove.component').then(
            (m) => m.ListRemoveComponent
          ),
      },
    ],
  },
];
