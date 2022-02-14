import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListShareComponent } from './list-share.component';

const ROUTES = [
  {
    path: '',
    component: ListShareComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  declarations: [ListShareComponent],
})
export class ListShareComponentModule {}
