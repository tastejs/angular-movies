import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
console.log('bootstrap app with noopzone');
platformBrowserDynamic()
  // **🚀 Perf Tip:**
  // Disable zone.js as change detection system.
  // Don't forget to remove `zone.js` import from the `polyfills.ts` file
  .bootstrapModule(AppModule, { ngZone: 'noop' })
  .catch((err) => console.error(err));
