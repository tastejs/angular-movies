import { NgModule } from '@angular/core';
import { ListRemoveComponent } from './list-remove.component';
import { RouterModule } from '@angular/router';

const ROUTES = [
  {
    path: '',
    component: ListRemoveComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  declarations: [ListRemoveComponent],
})
export class ListRemoveComponentModule {}
