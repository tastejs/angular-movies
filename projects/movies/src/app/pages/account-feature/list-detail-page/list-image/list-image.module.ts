import { NgModule } from '@angular/core';
import { GridListModule } from '../../../../ui/component/grid-list/grid-list.module';
import { ListImageComponent } from './list-image.component';
import { RouterModule } from '@angular/router';
import { ForModule } from '@rx-angular/template/experimental/for';

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
