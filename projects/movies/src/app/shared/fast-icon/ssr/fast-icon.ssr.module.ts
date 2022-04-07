import { ModuleWithProviders, NgModule } from '@angular/core';
import { SuspenseIcon } from '../token/suspense-icon.token';
import { suspenseIcon } from '../token/default-token-values';
import { FastIconModule } from '../fast-icon.module';

@NgModule({
  imports: [FastIconModule],
  declarations: [],
  exports: [],
})
export class FastIconSsrModule {
  static forServer(): ModuleWithProviders<FastIconSsrModule> {
    return {
      ngModule: FastIconSsrModule,
      providers: [
        {
          provide: SuspenseIcon,
          useValue: suspenseIcon,
        }
      ],
    };
  }
}
