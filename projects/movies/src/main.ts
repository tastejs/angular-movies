import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/**
 * **SSR transfer state requirement**
 *
 * The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and sub-frames to finish loading.
 *
 * This is crucial for transferred state object sent by server as part of the initial HTML page content, as without waiting for complete load app is (could be) bootstrapped before state object is accessible in DOM.
 */
document.addEventListener('DOMContentLoaded', () =>
  platformBrowserDynamic()
    /**
     * **🚀 Perf Tip for LCP, TTI, TBT:**
     *
     * Disable zone.js as change detection system.
     * Add { ngZone: 'noop' } to the bootstrap options
     *
     * ⚠ Notice:
     * Don't forget to:
     * - remove `zone.js` import from the `polyfills.ts` file
     * - trigger change detection manually after NavigationEnd (or use the provided helper `ZonelessRouting`)
     *
     * 💡 Additional Optimization:
     * Remove the `polyfills` option from your `angular.json` to save 1 request and 118b
     *
     */
    .bootstrapModule(AppModule, { ngZone: 'noop' })
    .catch((err) => console.error(err))
);
