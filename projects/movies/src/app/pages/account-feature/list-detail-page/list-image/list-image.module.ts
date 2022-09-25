import { ForModule } from '@rx-angular/template/for';
import { NgModule } from '@angular/core';
import { GridListModule } from '../../../../ui/component/grid-list/grid-list.module';
import { ListImageComponent } from './list-image.component';
import { RouterModule } from '@angular/router';
const ROUTES = [
  {
    path: '',
    component: ListImageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ForModule, GridListModule],
  declarations: [ListImageComponent],
})
export class ListImageComponentModule {}
