import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountDeleteModalComponent } from './account-delete-modal/account-delete-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [AccountComponent, AccountDeleteModalComponent],
  entryComponents: [AccountDeleteModalComponent],
})
export class AccountModule {}
