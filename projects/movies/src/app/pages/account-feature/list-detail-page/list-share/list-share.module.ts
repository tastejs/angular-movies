import { LetModule } from '@rx-angular/template/let';
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
  imports: [LetModule, RouterModule.forChild(ROUTES)],
  declarations: [ListShareComponent],
})
export class ListShareComponentModule {}
