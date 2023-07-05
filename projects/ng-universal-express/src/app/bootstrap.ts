import {bootstrapApplication} from '@angular/platform-browser';
import {AppServerComponent} from '../../movies/src/app/app.component.server';
import {appConfig} from './app.config';

import 'zone.js';

const bootstrap = () =>
  bootstrapApplication(AppServerComponent, appConfig);

export default bootstrap;
