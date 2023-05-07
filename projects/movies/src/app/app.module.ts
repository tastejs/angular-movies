import { NgModule } from '@angular/core';
import { APP_COMPONENT_IMPORTS, AppComponent } from './app.component';
import { APP_PROVIDERS } from './app.provider';
import { CUSTOM_ZONE_PROVIDER } from './shared/zone-less/noop-zone';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    APP_COMPONENT_IMPORTS,

    BrowserModule,

    /**
     * **🚀 Perf Tip for UX:**
     *
     * Setup serviceworker to get caching for HTTP requests and assets as well as better offline experience.
     */

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    ...APP_PROVIDERS,
    CUSTOM_ZONE_PROVIDER, // browser only
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
