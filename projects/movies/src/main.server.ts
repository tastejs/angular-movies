import {bootstrapApplication} from '@angular/platform-browser';
import {AppServerComponent} from './app/app.component.server';
import {appConfig} from './app/app.config.firebase';

import 'zone.js';

const bootstrap = () =>
  bootstrapApplication(AppServerComponent, appConfig);

export default bootstrap;
