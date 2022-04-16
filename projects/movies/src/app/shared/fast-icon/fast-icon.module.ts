import { ModuleWithProviders, NgModule } from '@angular/core';
import { FastIconComponent } from './fast-icon.component';
import { IconRegistry } from './icon-registry.service';
import { CommonModule } from '@angular/common';
import { FastSvgProviderOptions } from './provider-config.interface';
import { IconLoadStrategyImpl } from './token/icon-load.strategy';
import { IconLoadStrategy } from './token/icon-load.strategy.model';
import { IconOptionsToken } from './token/icon-options.token';
import { IconOptions } from './token/icon-options.model';

@NgModule({
  imports: [CommonModule],
  declarations: [FastIconComponent],
  exports: [FastIconComponent]
})
export class FastIconModule {

  static forRoot(providers: FastSvgProviderOptions): ModuleWithProviders<FastIconModule> {
    let iconOptions: IconOptions = {
      url: providers.url
    };
    providers?.suspenseIconString && (iconOptions.suspenseIconString = providers.suspenseIconString);
    providers?.defaultSize && (iconOptions.defaultSize = providers.defaultSize);

    return {
      ngModule: FastIconModule,
      providers: [
        {
          provide: IconLoadStrategy,
          useClass: providers.iconLoadStrategy || IconLoadStrategyImpl
        },
        {
          provide: IconOptionsToken,
          useValue: iconOptions
        },
        IconRegistry
      ]
    };
  }

  static forChild(): ModuleWithProviders<FastIconModule> {
    return {
      ngModule: FastIconModule,
      providers: []
    };
  }

}
