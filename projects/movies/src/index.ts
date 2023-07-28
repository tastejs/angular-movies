import {bootstrapApplication} from '@angular/platform-browser';
import {AppStandaloneComponent} from './app/app.component.standalone';
import {ApplicationConfig} from '@angular/core';
import {mergeBaseConfig} from './app/app.base.config';

const bootstrap = (config: ApplicationConfig = {providers: []}) =>
  bootstrapApplication(AppStandaloneComponent, mergeBaseConfig(config));


export default bootstrap;
export {environment} from "./environments/environment";
export {tmdbContentTypeInterceptor} from "./app/data-access/api/tmdbContentTypeInterceptor";
export {tmdbReadAccessInterceptor} from "./app/auth/tmdb-http-interceptor.feature";
export {ApplicationRendered} from "./app/shared/cdk/application-rendered/application-renderd-token";
