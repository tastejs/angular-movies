import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { RXA_PROVIDER_SSR } from './shared/rxa-custom/rxa.provider.ssr';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { IconLoadStrategySsr } from './ui/component/icons/icon-load.ssr.strategy';

@NgModule({
  declarations: [],
  imports: [
    AppModule,
    /**
     * **🚀 Perf Tip for LCP, CLS:**
     *
     * Setup SSR to increase LCP by shipping rendered HTML on first load.
     */
    ServerModule,
    FastSvgModule.forRoot({
      url: (name: string): string => {
        return `assets/svg-icons/${name}.svg`;
      },
      svgLoadStrategy: IconLoadStrategySsr,
    }),
    ServerTransferStateModule,
  ],
  providers: [RXA_PROVIDER_SSR],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
