import {ApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {provideFastSVG} from '@push-based/ngx-fast-svg';
import {RX_RENDER_STRATEGIES_CONFIG} from '@rx-angular/cdk/render-strategies';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {IconLoadStrategySsr} from './icon-load.ssr.strategy';
import {tmdbContentTypeInterceptor, tmdbReadAccessInterceptor} from "angular-movies";
import {provideNgZone} from "./provide-ngZone";

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(
      withInterceptors([tmdbContentTypeInterceptor, tmdbReadAccessInterceptor])
    ),
    provideFastSVG({
      url: (name: string) =>
        `dist/projects/movies/browser/assets/svg-icons/${name}.svg`,
      svgLoadStrategy: IconLoadStrategySsr,
    }),
    provideNgZone(),
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: {primaryStrategy: 'native'},
    }
  ],
};

export const appConfig = serverConfig;
