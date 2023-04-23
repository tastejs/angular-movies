import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { ModuleWithProviders, Type } from '@angular/core';

export const RXA_PROVIDER_SSR: Array<
  Type<any> | ModuleWithProviders<{}> | any[] | any
> = [
  {
    provide: RX_RENDER_STRATEGIES_CONFIG,
    useValue: {
      primaryStrategy: 'native',
    },
  },
];
