import { NgModule } from '@angular/core';
import { AppComponent, APP_COMPONENT_IMPORTS } from './app.component';
import { APP_PROVIDERS } from './app.provider';
import { APP_IMPORTS } from './app.imports';

@NgModule({
  declarations: [AppComponent],
  imports: [APP_IMPORTS, APP_COMPONENT_IMPORTS],
  providers: APP_PROVIDERS,
  bootstrap: [AppComponent],
})
export class AppModule {}
