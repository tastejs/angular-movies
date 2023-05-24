import {
  mergeApplicationConfig,
  ApplicationConfig,
  Provider,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { IconLoadStrategyWorker } from './ui/component/icons/icon-load.ssr.strategy';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { provideHttpClient } from '@angular/common/http';
import { withFetch } from './angular-common/fetch';
// import { provideISR } from 'ngx-isr';

const serverConfig = (otherProviders: Provider[] = []): ApplicationConfig => {
  return {
    providers: [
      provideServerRendering(),
      provideHttpClient(withFetch()),
      provideFastSVG({
        url: (name: string) => `assets/svg-icons/${name}.svg`,
        // svgLoadStrategy: IconLoadStrategySsr,
        svgLoadStrategy: IconLoadStrategyWorker,
      }),
      // provideISR(),
      {
        provide: RX_RENDER_STRATEGIES_CONFIG,
        useValue: { primaryStrategy: 'native' },
      },
      ...otherProviders,
    ],
  };
};

export const config = (otherProviders: Provider[] = []) =>
  mergeApplicationConfig(appConfig, serverConfig(otherProviders));
