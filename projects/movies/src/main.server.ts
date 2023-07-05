import {bootstrapApplication} from '@angular/platform-browser';
import {AppServerComponent} from './app/app.component.server';

import 'zone.js';
import {appConfig} from "./app/app.config.firebase";
import {ApplicationConfig, ApplicationRef} from "@angular/core";

export const bootstrap = (applicationConfig: ApplicationConfig = {} as ApplicationConfig): Promise<ApplicationRef> => {
  return bootstrapApplication(AppServerComponent, appConfig(applicationConfig));
}
export default bootstrap;
