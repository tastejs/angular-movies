import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListPageComponent } from './account-list-page.component';
import { RxForModule } from '../../shared/rxa-custom/rx-for/rx-for.module';

const ROUTES: Routes = [
  {
    path: '',
    component: AccountListPageComponent,
  },
];

@NgModule({
  declarations: [AccountListPageComponent],
  imports: [RxForModule, RouterModule.forChild(ROUTES)],
  exports: [AccountListPageComponent],
})
export class AccountListPageModule {}
