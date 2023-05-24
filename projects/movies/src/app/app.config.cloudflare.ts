import {
  mergeApplicationConfig,
  ApplicationConfig,
  Provider,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { provideHttpClient } from '@angular/common/http';
import { withFetch } from './angular-common/fetch';
import { IconLoadStrategyWorker } from './ui/component/icons/icon-load.worker.strategy';

const cloudflareServerConfig = (
  otherProviders: Provider[] = []
): ApplicationConfig => {
  return {
    providers: [
      provideServerRendering(),
      provideHttpClient(withFetch()),
      provideFastSVG({
        url: (name: string) => `assets/svg-icons/${name}.svg`,
        svgLoadStrategy: IconLoadStrategyWorker,
      }),
      {
        provide: RX_RENDER_STRATEGIES_CONFIG,
        useValue: { primaryStrategy: 'native' },
      },
      ...otherProviders,
    ],
  };
};

export const cloudlfareAppConfig = (otherProviders: Provider[] = []) =>
  mergeApplicationConfig(appConfig, cloudflareServerConfig(otherProviders));
