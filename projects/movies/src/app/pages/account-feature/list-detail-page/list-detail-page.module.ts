import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { ListDetailPageComponent } from './list-detail-page.component';
import { LazyModule } from '../../../shared/cdk/lazy/lazy.module';
import { TabsComponentModule } from '../../../ui/component/tabs/tabs.component';
import { ListEditFormComponentModule } from '../../../ui/pattern/list-edit-form/list-edit-form.component';

const ROUTES = [
  {
    path: '',
    component: ListDetailPageComponent,
    children: [
      {
        path: 'edit',
        component: ListDetailPageComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [ListDetailPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    LetModule,
    LazyModule,
    TabsComponentModule,
    // TODO: Renders empty when lazy-loaded, need to fix.
    // CONSIDER: Reduces shifts if not lazy-loaded
    ListEditFormComponentModule,
  ],
  exports: [ListDetailPageComponent],
})
export class ListDetailsPageModule {}
