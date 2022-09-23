import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ListMoviesComponent } from './list-movies.component';

const ROUTES = [
  {
    path: '',
    component: ListMoviesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class ListMoviesComponentModule {}
