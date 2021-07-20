import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ShareModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyLink(movieId) {
    const inputElement = document.getElementById('inputId');
    (inputElement as any).select();
    document.execCommand('copy');
    inputElement.blur();
    this.snackBar.open('ERROR', '', { duration: 2000 });
    this.dialogRef.close();
  }
}
