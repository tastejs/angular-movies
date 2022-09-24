import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListItemsEditComponent } from './list-items-edit.component';
import { ROUTES } from './list-items-edit.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ListItemsEditComponent],
  declarations: [],
})
export class ListItemsEditComponentModule {}
