import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { APP_PROVIDERS } from './app/app.provider';
import { APP_IMPORTS } from './app/app.imports';

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
  bootstrapApplication(AppComponent, {
    providers: [APP_PROVIDERS, importProvidersFrom(APP_IMPORTS)],
  }).catch((err) => console.error(err))
);
