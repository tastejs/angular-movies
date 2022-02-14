import { NgModule } from '@angular/core';
import { ListImageComponent } from './list-image.component';
import { RouterModule } from '@angular/router';

const ROUTES = [
  {
    path: '',
    component: ListImageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  declarations: [ListImageComponent],
})
export class ListImageComponentModule {}
