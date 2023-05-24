import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { provideHttpClient } from '@angular/common/http';
import { withFetch } from './angular-common/fetch';
import { provideISR } from 'ngx-isr';
import { IconLoadStrategySsr } from './ui/component/icons/icon-load.ssr.strategy';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),
    provideISR(),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
      svgLoadStrategy: IconLoadStrategySsr,
    }),
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: { primaryStrategy: 'native' },
    },
  ],
};

export const serverAppConfig = mergeApplicationConfig(appConfig, serverConfig);
