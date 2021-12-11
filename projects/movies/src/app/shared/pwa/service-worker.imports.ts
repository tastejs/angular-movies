import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../../environments/environment';
import { ModuleWithProviders, Type } from '@angular/core';


export const SERVICE_WORKER_IMPORTS: Array<Type<any> | ModuleWithProviders<{}> | any[]> = [
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ];
