import { NgModule } from '@angular/core';
import { FastIconComponent } from './fast-icon.component';
import { CommonModule } from '@angular/common';
import { SuspenseIcon } from './token/suspense-icon.token';
import { FallbackIcon } from './token/fallback-icon.token';
import { fallbackIcon, suspenseIcon } from './token/default-token-values';

@NgModule({
  imports: [CommonModule],
  declarations: [FastIconComponent],
  providers: [
    {
      provide: SuspenseIcon,
      useValue: () => suspenseIcon,
    },
    {
      provide: FallbackIcon,
      useValue: () => fallbackIcon,
    },
  ],
  exports: [FastIconComponent],
})
export class FastIconModule {}
