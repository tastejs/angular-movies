import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDetailPageComponent } from './list-detail-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ListDetailPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'view',
      },
      {
        path: 'view',
        loadChildren: () =>
          import('./list-movies/list-movies.module').then(
            (m) => m.ListMoviesComponentModule
          ),
      },
      {
        path: 'edit',
        loadChildren: () =>
          import(
            'projects/movies/src/app/pages/account-feature/list-create-page/list-create-page.module'
          ).then((m) => m.ListCreatePageModule),
      },
      {
        path: 'add-remove-items',
        loadChildren: () =>
          import('./list-items-edit/list-items-edit.module').then(
            (m) => m.ListItemsEditComponentModule
          ),
      },
      {
        path: 'image',
        loadChildren: () =>
          import('./list-image/list-image.module').then(
            (m) => m.ListImageComponentModule
          ),
      },
      {
        path: 'delete',
        loadChildren: () =>
          import('./list-remove/list-remove.module').then(
            (m) => m.ListRemoveComponentModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ListDetailPageComponent],
})
export class ListDetailsPageModule {}
