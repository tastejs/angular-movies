import { ModuleWithProviders, NgModule } from '@angular/core';
import { FastIconComponent } from './fast-icon.component';
import { CommonModule } from '@angular/common';
import { SuspenseIcon } from './token/suspense-icon.token';
import { suspenseIcon } from './token/default-token-values';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TransferStateInterceptor } from './transfere-state.intercepter';

@NgModule({
  imports: [CommonModule],
  declarations: [FastIconComponent],
  exports: [FastIconComponent],
})
export class FastIconModule {
  static forClient(): ModuleWithProviders<FastIconModule> {
    return {
      ngModule: FastIconModule,
      providers: [
        {
          provide: SuspenseIcon,
          useValue: suspenseIcon,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TransferStateInterceptor,
          multi: true,
        },
      ],
    };
  }
}
