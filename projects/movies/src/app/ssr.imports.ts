import { TransferHttpCacheModule } from '@nguniversal/common';
import { ModuleWithProviders, Type } from '@angular/core';


export const SSR_IMPORTS: Array<Type<any> | ModuleWithProviders<{}> | any[]> = [
  /**
   * **🚀 Perf Tip for LCP, CLS:**
   *
   * Fetch data on while SSR and reuse this data directly in the app to avoid overfetchung.
   */
  TransferHttpCacheModule
];
