import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-categories-add-modal',
  templateUrl: './categories-add-modal.component.html',
  styleUrls: ['./categories-add-modal.component.scss']
})
export class CategoriesAddModalComponent {

  constructor(
    public dialogRef: MatDialogRef<CategoriesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
