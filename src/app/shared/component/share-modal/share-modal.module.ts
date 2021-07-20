import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModalComponent } from './share-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [ShareModalComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule],
  exports: [ShareModalComponent],
})
export class ShareModalModule {}
