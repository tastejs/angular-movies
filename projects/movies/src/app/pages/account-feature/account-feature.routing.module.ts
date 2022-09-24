import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './account-list-page/account-list-page.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [],
})
export class AccountFeatureRoutingModule {}
