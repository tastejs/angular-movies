import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { ForModule } from '@rx-angular/template/experimental/for';
import { FastIconModule } from '../../../../shared/fast-icon/fast-icon.module';
import { ListItemsEditComponent } from './list-items-edit.component';

const ROUTES = [
  {
    path: '',
    component: ListItemsEditComponent,
  },
];

@NgModule({
  imports: [
    ForModule,
    LetModule,
    RouterModule.forChild(ROUTES),
    FastIconModule,
  ],
  declarations: [ListItemsEditComponent],
})
export class ListItemsEditComponentModule {}
