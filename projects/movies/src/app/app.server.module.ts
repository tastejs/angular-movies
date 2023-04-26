import {NgModule} from '@angular/core';
import {APP_COMPONENT_IMPORTS, AppComponent} from './app.component';
import {APP_IMPORTS} from "./app.imports";
import {ServerModule} from "@angular/platform-server";
import {RX_RENDER_STRATEGIES_CONFIG} from "@rx-angular/cdk/render-strategies";
import {FastSvgModule} from "@push-based/ngx-fast-svg";
import {IconLoadStrategySsr} from "./ui/component/icons/icon-load.ssr.strategy";
import {APP_PROVIDERS} from "./app.provider";

@NgModule({
  declarations: [AppComponent],
  imports: [
    APP_COMPONENT_IMPORTS,
    APP_IMPORTS,
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
  ],
  providers: [
    APP_PROVIDERS,
    {
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: {
        primaryStrategy: 'native',
      },
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}
