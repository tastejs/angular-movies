import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ShareModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyLink(movieId) {
    const inputElement = document.getElementById('inputId');
    (inputElement as any).select();
    document.execCommand('copy');
    inputElement.blur();
    this.translateService.get('Error.Link').subscribe(results => this.snackBar.open(results, '', { duration: 2000 }));
    this.dialogRef.close();
  }

}
