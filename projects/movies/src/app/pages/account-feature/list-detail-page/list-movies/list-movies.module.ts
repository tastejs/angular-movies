import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './list-movies.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class ListMoviesComponentModule {}
