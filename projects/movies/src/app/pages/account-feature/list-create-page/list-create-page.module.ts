import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './list-create-page.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [],
})
export class ListCreatePageModule {}
