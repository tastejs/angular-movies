import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './account-list-page.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class AccountFeatureRoutingModule {}
