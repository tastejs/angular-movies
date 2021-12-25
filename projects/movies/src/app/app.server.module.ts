import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { RXA_PROVIDER_SSR } from './shared/rxa-custom/rxa.provider.ssr';
import { SSR_IMPORTS } from './shared/ssr/ssr.imports';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule.withServerTransition({ appId: 'movies' }),
    AppModule,
    /**
     * **🚀 Perf Tip for LCP, CLS:**
     *
     * Setup SSR to increase LCP by shipping rendered HTML on first load.
     */
    SSR_IMPORTS,
  ],
  providers: [
    RXA_PROVIDER_SSR
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
}
