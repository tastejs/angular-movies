import { FastSvgModule } from '@push-based/ngx-fast-svg';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { IconLoadStrategySsr } from '../ui/component/icons/icon-load.ssr.strategy';
import { APP_IMPORTS } from '../app.imports';

export const APP_SERVER_IMPORTS = [
  APP_IMPORTS,
  /**
   * **🚀 Perf Tip for LCP, CLS:**
   *
   * Setup SSR to increase LCP by shipping rendered HTML on first load.
   */
  ServerModule,
  ServerTransferStateModule,
  FastSvgModule.forRoot({
    url: (name: string): string => {
      return `assets/svg-icons/${name}.svg`;
    },
    svgLoadStrategy: IconLoadStrategySsr,
  }),
];
