import { bootstrapApplication } from '@angular/platform-browser';
import { AppServerComponent } from './app/app.component.server';
import { config } from './app/app.config.server';

import 'zone.js';

const bootstrap = () => bootstrapApplication(AppServerComponent, config);

export default bootstrap;
