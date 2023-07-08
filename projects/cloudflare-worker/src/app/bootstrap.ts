import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import bootstrapMovies from 'angular-mvies'
import 'zone.js'
import {appConfig} from "./app.config";

const bootstrap = (config: ApplicationConfig) => bootstrapMovies(mergeApplicationConfig(appConfig, config));

export default bootstrap;
