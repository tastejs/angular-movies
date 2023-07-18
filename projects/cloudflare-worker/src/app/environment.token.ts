import {InjectionToken, Provider} from '@angular/core';

export interface EdgeEnvironment {
  ASSETS: { fetch: typeof fetch };
  NGMOVIES: any; // namespace
}

export interface EdgeEnvironmentData {
  env: EdgeEnvironment;
  request: Request;
}

export const EdgeEnvironmentToken = new InjectionToken<EdgeEnvironmentData>(
  'EdgeEnv'
);

export const provideEdgeEnvironment = ({
                                         env,
                                         request,
                                       }: EdgeEnvironmentData): Provider => ({
  provide: EdgeEnvironmentToken,
  useValue: {env, request},
});
