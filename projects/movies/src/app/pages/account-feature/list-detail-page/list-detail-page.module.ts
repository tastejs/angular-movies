import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { FastIconModule } from '../../../shared/fast-icon/fast-icon.module';
import { ListDetailPageComponent } from './list-detail-page.component';
import { MovieListModule } from '../../../ui/pattern/movie-list/movie-list.module';
import { ForModule } from '@rx-angular/template/experimental/for';

const ROUTES = [
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
  declarations: [ListDetailPageComponent],
  imports: [
    RouterModule.forChild(ROUTES),
    LetModule,
    ForModule,
    MovieListModule,
    FastIconModule,
  ],
})
export class ListDetailsPageModule {}
