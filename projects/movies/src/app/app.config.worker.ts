import {ApplicationConfig,} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {RX_RENDER_STRATEGIES_CONFIG} from '@rx-angular/cdk/render-strategies';
import {provideHttpClient} from '@angular/common/http';
import {withFetch} from './angular-common/fetch';
import {IconLoadStrategyWorker} from './ui/component/icons/icon-load.worker.strategy';
import {mergeBaseConfig} from "./app.base.config";

export const cloudflareServerConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // order is strict requirement for withFetch!
    provideHttpClient(withFetch()),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
      svgLoadStrategy: IconLoadStrategyWorker,
    }),
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: {primaryStrategy: 'native'},
    }
  ]
};

// We provide the config function as closure to be able to inject configuration from the consuming end
export const appConfig = (outerConfig: ApplicationConfig = {providers: []}) => mergeBaseConfig(cloudflareServerConfig, outerConfig);
