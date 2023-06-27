import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {baseAppConfig} from './app.base.config';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {RX_RENDER_STRATEGIES_CONFIG} from '@rx-angular/cdk/render-strategies';
import {provideHttpClient} from '@angular/common/http';
import {provideISR} from 'ngx-isr';
import {IconLoadStrategySsr} from './ui/component/icons/icon-load.ssr.strategy';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(),
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

export const appConfig = mergeApplicationConfig(baseAppConfig, serverConfig);
