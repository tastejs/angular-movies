import {ApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {RX_RENDER_STRATEGIES_CONFIG} from '@rx-angular/cdk/render-strategies';
import {provideHttpClient} from '@angular/common/http';
import {provideISR} from 'ngx-isr';
import {IconLoadStrategySsr} from './ui/component/icons/icon-load.ssr.strategy';
import {mergeBaseConfig} from "./app.config";

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(),
    provideISR(),
    provideFastSVG({
      url: (name: string) => `dist/projects/movies/browser/assets/svg-icons/${name}.svg`,
      svgLoadStrategy: IconLoadStrategySsr,
    }),
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: {primaryStrategy: 'native'},
    },
  ],
};

// We provide the config function as closure to be able to inject configuration from the consuming end
export const appConfig = (outerConfig: ApplicationConfig = {} as ApplicationConfig) => mergeBaseConfig(serverConfig, outerConfig);
