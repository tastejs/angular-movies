import { FastIconModule } from '../shared/fast-icon/fast-icon.module';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { IconLoadStrategySsr } from '../ui/component/icons/icon-load.ssr.strategy';

export const APP_SERVER_IMPORTS = [
  /**
   * **🚀 Perf Tip for LCP, CLS:**
   *
   * Setup SSR to increase LCP by shipping rendered HTML on first load.
   */
  ServerModule,
  ServerTransferStateModule,
  FastIconModule.forRoot({
    url: (name: string): string => {
      return `assets/svg-icons/${name}.svg`;
    },
    iconLoadStrategy: IconLoadStrategySsr,
  }),
];
