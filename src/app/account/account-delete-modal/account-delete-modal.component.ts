import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-delete-modal',
  templateUrl: './account-delete-modal.component.html',
  styleUrls: ['./account-delete-modal.component.scss']
})
export class AccountDeleteModalComponent {

  constructor(public dialogRef: MatDialogRef<AccountDeleteModalComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
