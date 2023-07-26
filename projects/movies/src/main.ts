import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "./app/app.module";

/**
 * We have to use `platformBrowserDynamic` until Angular allows to run `bootstrapApplication` in zone-less mode
 */
platformBrowserDynamic()
  .bootstrapModule(AppModule, {ngZone: 'noop'})
  .catch((err) => console.error(err));
