import {bootstrapApplication} from '@angular/platform-browser';
import {AppServerComponent} from './app/app.component.server';
import 'zone.js';
import {ApplicationConfig, mergeApplicationConfig} from "@angular/core";
import {baseAppConfig} from "./app/app.base.config";

const bootstrap = (config: ApplicationConfig = {providers: []}) =>
  bootstrapApplication(AppServerComponent, mergeApplicationConfig(baseAppConfig, config));

export default bootstrap;
