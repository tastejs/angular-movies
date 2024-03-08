import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { IconLoadStrategySsr } from './shared/ssr/icon-load.ssr.strategy';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),

    // provideHttpClient(
    //   withInterceptors([
    //     requestTimingInterceptor((_request) => {
    //       return _request.urlWithParams.replace(
    //         'https://api.themoviedb.org/3',
    //         'api'
    //       );
    //     }),
    //   ])
    // ),

    provideFastSVG({
      url: (name: string) => `${name}.svg`,
      svgLoadStrategy: IconLoadStrategySsr,
    }),

    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: { primaryStrategy: 'native' },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
