import { TransferHttpCacheModule } from '@nguniversal/common';
import { ModuleWithProviders, Type } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';


export const SSR_IMPORTS: Array<Type<any> | ModuleWithProviders<{}> | any[]> = [
  ServerModule,
  ServerTransferStateModule,
  /**
   * **🚀 Perf Tip for LCP, CLS:**
   *
   * Fetch data on while SSR and reuse this data directly in the app to avoid overfetchung.
   */
  TransferHttpCacheModule,
  BrowserTransferStateModule
];
