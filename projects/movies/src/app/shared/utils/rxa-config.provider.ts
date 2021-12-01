import { RX_ANGULAR_CONFIG } from '@rx-angular/cdk';
import { customStrategyCredentials } from './custom-strategies';

export const rxaConfigProviders = [
  {
    provide: RX_ANGULAR_CONFIG,
    useValue: {
      customStrategies: customStrategyCredentials,
      /**
       * **🚀 Perf Tip for TTI:**
       *
       * Configure RxAngular's default behaviour to avoid any additional zone-logic to run.
       * This could en up in missing view updates for template projection, but can be applied by directive to fix it granulary.
       */
      patchZone: false
    }
  }
];
