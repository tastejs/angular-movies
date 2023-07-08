import {mergeApplicationConfig, Provider,} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {baseAppConfig} from './app.base.config';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {RX_RENDER_STRATEGIES_CONFIG} from '@rx-angular/cdk/render-strategies';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {IconLoadStrategyWorker} from './ui/component/icons/icon-load.worker.strategy';

const cloudflareServerConfig = {
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

export const cloudlfareAppConfig = (otherProviders: Provider[] = []) =>
  mergeApplicationConfig(baseAppConfig, cloudflareServerConfig, {providers: otherProviders});
