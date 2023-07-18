import {ApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {RX_RENDER_STRATEGIES_CONFIG} from '@rx-angular/cdk/render-strategies';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideISR} from 'ngx-isr';
import {IconLoadStrategySsr} from './icon-load.ssr.strategy';
import {tmdbContentTypeInterceptor} from '../../../movies/src/app/data-access/api/tmdbContentTypeInterceptor';
import {tmdbReadAccessInterceptor} from '../../../movies/src/app/auth/tmdb-http-interceptor.feature';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(
      withInterceptors([tmdbContentTypeInterceptor, tmdbReadAccessInterceptor])
    ),
    provideISR(),
    provideFastSVG({
      url: (name: string) =>
        `dist/projects/movies/browser/assets/svg-icons/${name}.svg`,
      svgLoadStrategy: IconLoadStrategySsr,
    }),
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: {primaryStrategy: 'native'},
    },
  ],
};

export const appConfig = serverConfig;
