import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountListPageComponent } from './account-list-page.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import { ROUTES } from './account-list-page.routes';

@NgModule({
  declarations: [AccountListPageComponent],
  imports: [ForModule, RouterModule.forChild(ROUTES)],
  exports: [AccountListPageComponent],
})
export class AccountListPageModule {}
