import {bootstrapApplication} from '@angular/platform-browser';
import {AppServerComponent} from './app/app.component.standalone';
import 'zone.js';
import {ApplicationConfig} from "@angular/core";
import {mergeBaseConfig} from "./app/app.base.config";

const bootstrap = (config: ApplicationConfig = {providers: []}) =>
  bootstrapApplication(AppServerComponent, mergeBaseConfig(config));

export default bootstrap;
