import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categories-delete-modal',
  template: `
    <h1 mat-dialog-title>{{ 'Categories-delete.Title' | translate }}</h1>
    <div mat-dialog-content>
      <p>{{ 'Categories-delete.Content' | translate }}</p>
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
export class CategoriesDeleteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoriesDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
