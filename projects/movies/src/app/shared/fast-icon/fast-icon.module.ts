import { NgModule } from '@angular/core';
import { FastIconComponent } from './fast-icon.component';
import { CommonModule } from '@angular/common';
import { SuspenseIcon } from './token/suspense-icon.token';
import { suspenseIcon } from './token/default-token-values';

@NgModule({
  imports: [CommonModule],
  declarations: [FastIconComponent],
  providers: [
    {
      provide: SuspenseIcon,
      useValue: suspenseIcon,
    },
  ],
  exports: [FastIconComponent],
})
export class FastIconModule {}
