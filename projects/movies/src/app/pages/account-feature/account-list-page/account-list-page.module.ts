import { ForModule } from '@rx-angular/template/for';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GridListModule } from '../../../ui/component/grid-list/grid-list.module';
import { AccountListPageComponent } from './account-list-page.component';
import { ROUTES } from './account-list-page.routes';

@NgModule({
  declarations: [AccountListPageComponent],
  imports: [ForModule, RouterModule.forChild(ROUTES), GridListModule],
  exports: [AccountListPageComponent],
})
export class AccountListPageModule {}
