import { NgModule } from '@angular/core';
import { ListRemoveComponent } from './list-remove.component';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template';

const ROUTES = [
  {
    path: '',
    component: ListRemoveComponent,
  },
];

@NgModule({
  imports: [LetModule, RouterModule.forChild(ROUTES)],
  declarations: [ListRemoveComponent],
})
export class ListRemoveComponentModule {}
