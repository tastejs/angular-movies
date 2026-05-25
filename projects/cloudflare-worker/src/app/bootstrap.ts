import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';
import { AppComponent } from '../../../movies/src/app/app.component';
import { appConfig as moviesAppConfig } from '../../../movies/src/app/app.config';
import { appConfig as cloudflareConfig } from './app.config';

const serverConfig = mergeApplicationConfig(moviesAppConfig, cloudflareConfig);

const bootstrap = (
  context: BootstrapContext,
  extraConfig?: ApplicationConfig
) =>
  bootstrapApplication(
    AppComponent,
    extraConfig
      ? mergeApplicationConfig(serverConfig, extraConfig)
      : serverConfig,
    context
  );

export default bootstrap;
