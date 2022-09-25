import { ForModule } from '@rx-angular/template/for';
import { LetModule } from '@rx-angular/template/let';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { ListItemsEditComponent } from './list-items-edit.component';

const ROUTES = [
  {
    path: '',
    component: ListItemsEditComponent,
  },
];

@NgModule({
  imports: [ForModule, LetModule, RouterModule.forChild(ROUTES), FastSvgModule],
  declarations: [ListItemsEditComponent],
})
export class ListItemsEditComponentModule {}
