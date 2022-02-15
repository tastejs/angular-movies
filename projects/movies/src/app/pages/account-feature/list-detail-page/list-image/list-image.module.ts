import { NgModule } from '@angular/core';
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
  imports: [RouterModule.forChild(ROUTES), ForModule],
  declarations: [ListImageComponent],
})
export class ListImageComponentModule {}
