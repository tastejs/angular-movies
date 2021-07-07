import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categories-add-modal',
  template: `
    <h1 mat-dialog-title>{{ 'Categories-add.Title' | translate }}</h1>
    <div mat-dialog-content>
      <p>{{ 'Categories-add.Content' | translate }}</p>
      <mat-form-field>
        <input matInput [(ngModel)]="data.name" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">
        {{ 'Btn-cancel' | translate }}
      </button>
      <button mat-button [mat-dialog-close]="data.name" cdkFocusInitial>
        OK
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesAddModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoriesAddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
