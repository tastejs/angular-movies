import {bootstrapApplication} from '@angular/platform-browser';
import {AppStandaloneComponent} from './app/app.component.standlaone';
import 'zone.js';
import {ApplicationConfig, mergeApplicationConfig} from "@angular/core";
import {baseAppConfig} from "./app/app.base.config";

const bootstrap = (config: ApplicationConfig = {providers: []}) =>
  bootstrapApplication(AppStandaloneComponent, mergeApplicationConfig(baseAppConfig, config));

export default bootstrap;

