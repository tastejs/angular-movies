import { bootstrapApplication } from '@angular/platform-browser';
import { AppServerComponent } from './app/app.component.server';
import { serverAppConfig } from './app/app.config.server';

import 'zone.js';

const bootstrap = () =>
  bootstrapApplication(AppServerComponent, serverAppConfig);

export default bootstrap;
