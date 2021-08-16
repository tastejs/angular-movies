import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModalComponent } from './share-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ShareModalComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [ShareModalComponent],
})
export class ShareModalModule {}
