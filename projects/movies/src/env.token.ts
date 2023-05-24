import { InjectionToken, Provider } from '@angular/core';

export interface EdgeEnv {
  ASSETS: { fetch: typeof fetch };
}

export interface EdgeEnvData {
  env: EdgeEnv;
  request: Request;
}

export const EdgeEnvToken = new InjectionToken<EdgeEnvData>('EdgeEnv');

export const provideEdgeEnv = ({ env, request }: EdgeEnvData): Provider => ({
  provide: EdgeEnvToken,
  useValue: { env, request },
});
