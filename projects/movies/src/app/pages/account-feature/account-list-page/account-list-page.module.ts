import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountListPageComponent } from './account-list-page.component';
import { ROUTES } from './account-list-page.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES), AccountListPageComponent],
  exports: [AccountListPageComponent],
})
export class AccountListPageModule {}
