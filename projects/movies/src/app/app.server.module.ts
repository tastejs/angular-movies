import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { withFetch } from './angular-common/fetch';
import { APP_COMPONENT_IMPORTS, AppComponent } from './app.component';
import { APP_PROVIDERS } from './app.provider';
import { IconLoadStrategySsr } from './ui/component/icons/icon-load.ssr.strategy';

@NgModule({
  declarations: [AppComponent],
  imports: [
    APP_COMPONENT_IMPORTS,
    /**
     * **🚀 Perf Tip for LCP, CLS:**
     *
     * Setup SSR to increase LCP by shipping rendered HTML on first load.
     */
    ServerModule,
  ],
  providers: [
    APP_PROVIDERS,
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: {
        primaryStrategy: 'native',
      },
    },
    provideFastSVG({
      svgLoadStrategy: IconLoadStrategySsr,
      url: (name: string): string => `assets/svg-icons/${name}.svg`,
    }),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
