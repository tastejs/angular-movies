import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { IconLoadStrategySsr } from './ui/component/icons/icon-load.ssr.strategy';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { provideISR } from 'ngx-isr';
import {provideHttpClient} from "@angular/common/http";
import {withFetch} from "./angular-common/fetch";

const serverConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideServerRendering(),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${ name }.svg`,
      svgLoadStrategy: IconLoadStrategySsr,
    }),
    provideISR(),
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: { primaryStrategy: 'native' },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
