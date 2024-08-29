import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IconLoadStrategySsr } from './icon-load.ssr.strategy';
import {
  provideTmdbImageLoader,
  tmdbContentTypeInterceptor,
  tmdbReadAccessInterceptor,
} from 'angular-movies';
import { requestTimingInterceptor } from './http-timing.interceptor';
import { join } from 'node:path';
import { cwd } from 'node:process';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(
      withInterceptors([
        tmdbContentTypeInterceptor,
        tmdbReadAccessInterceptor,
        requestTimingInterceptor((_request) => {
          return _request.urlWithParams.replace(
            'https://api.themoviedb.org/3',
            'api',
          );
        }),
      ]),
    ),
    provideTmdbImageLoader(),
    provideFastSVG({
      url: (name: string) =>
        join(
          cwd(),
          'dist',
          'projects',
          'movies',
          'browser',
          'assets',
          'svg-icons',
          `${name}.svg`,
        ),
      svgLoadStrategy: IconLoadStrategySsr,
    }),
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: { primaryStrategy: 'native' },
    },
  ],
};

export const appConfig = serverConfig;
