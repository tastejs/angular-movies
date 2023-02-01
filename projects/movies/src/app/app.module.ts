import { NgModule, NgZone } from '@angular/core';
import { APP_COMPONENT_IMPORTS, AppComponent } from './app.component';
import { APP_PROVIDERS } from './app.provider';
import { APP_IMPORTS } from './app.imports';
import { CustomNgZone } from './shared/zone-less/noop-zone';

@NgModule({
  declarations: [AppComponent],
  imports: [APP_IMPORTS, APP_COMPONENT_IMPORTS],
  providers: [
    ...APP_PROVIDERS,
    {
      provide: NgZone,
      useClass: CustomNgZone,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
