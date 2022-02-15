import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForModule } from '@rx-angular/template/experimental/for';
import { ListItemsEditComponent } from './list-items-edit.component';

const ROUTES = [
  {
    path: '',
    component: ListItemsEditComponent,
  },
];

@NgModule({
  imports: [ForModule, RouterModule.forChild(ROUTES)],
  declarations: [ListItemsEditComponent],
})
export class ListItemsEditComponentModule {}
