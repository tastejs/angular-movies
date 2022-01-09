import { RX_ANGULAR_CONFIG } from '@rx-angular/cdk';
import { ModuleWithProviders, Type } from '@angular/core';

export const RXA_PROVIDER_SSR: Array<
  Type<any> | ModuleWithProviders<{}> | any[] | any
> = [
  {
    provide: RX_ANGULAR_CONFIG,
    useValue: {
      primaryStrategy: 'native',
    },
  },
];
