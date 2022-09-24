import { importProvidersFrom } from '@angular/core';
import { FastIconModule } from './shared/fast-icon/fast-icon.module';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { IconLoadStrategySsr } from './ui/component/icons/icon-load.ssr.strategy';
import { RXA_PROVIDER_SSR } from './shared/rxa-custom/rxa.provider.ssr';
import { APP_PROVIDERS } from './app.provider';

export const APP_SERVER_PROVIDERS = [
  APP_PROVIDERS,
  importProvidersFrom(
    /**
     * **🚀 Perf Tip for LCP, CLS:**
     *
     * Setup SSR to increase LCP by shipping rendered HTML on first load.
     */
    ServerModule,
    ServerTransferStateModule,
    FastIconModule.forRoot({
      url: (name: string): string => {
        return `assets/svg-icons/${name}.svg`;
      },
      iconLoadStrategy: IconLoadStrategySsr,
    })
  ),
  RXA_PROVIDER_SSR,
];
