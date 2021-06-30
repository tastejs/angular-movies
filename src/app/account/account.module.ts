import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountDeleteModalComponent } from './account-delete-modal/account-delete-modal.component';

import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule
  ],
  declarations: [
    AccountComponent,
    AccountDeleteModalComponent
  ],
  entryComponents: [AccountDeleteModalComponent]
})
export class AccountModule { }
