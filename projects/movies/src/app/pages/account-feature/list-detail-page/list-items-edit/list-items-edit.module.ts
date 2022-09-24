import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './list-items-edit.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class ListItemsEditComponentModule {}
