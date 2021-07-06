import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-categories-delete-modal',
  templateUrl: './categories-delete-modal.component.html',
  styleUrls: ['./categories-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesDeleteModalComponent {

  constructor(
    public dialogRef: MatDialogRef<CategoriesDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
