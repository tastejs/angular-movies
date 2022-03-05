import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForModule } from '@rx-angular/template/experimental/for';
import { GridListModule } from '../../../ui/component/grid-list/grid-list.module';
import { AccountListPageComponent } from './account-list-page.component';
import { ROUTES } from './account-list-page.routes';

@NgModule({
  declarations: [AccountListPageComponent],
  imports: [ForModule, RouterModule.forChild(ROUTES), GridListModule],
  exports: [AccountListPageComponent],
})
export class AccountListPageModule {}
