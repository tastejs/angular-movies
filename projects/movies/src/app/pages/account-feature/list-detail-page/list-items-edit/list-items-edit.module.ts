import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListItemsEditComponent } from './list-items-edit.component';

const ROUTES = [
  {
    path: '',
    component: ListItemsEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ListItemsEditComponent],
  declarations: [],
})
export class ListItemsEditComponentModule {}
