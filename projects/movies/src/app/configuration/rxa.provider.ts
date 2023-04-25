import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { ModuleWithProviders, Type } from '@angular/core';

export const RXA_PROVIDER: Array<
  Type<any> | ModuleWithProviders<{}> | any[] | any
> = [
  {
    provide: RX_RENDER_STRATEGIES_CONFIG,
    useValue: {
      /**
       * **🚀 Perf Tip for TTI:**
       *
       * Configure RxAngular's default behaviour to avoid any additional zone-logic to run.
       * This could en up in missing view updates for template projection, but can be applied by directive to fix it granulary.
       */
      patchZone: false,
    },
  },
];
