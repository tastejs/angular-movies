import { environment } from '../../../environments/environment';

export const baseUrlApiV3 = [environment.tmdbBaseUrl, environment.apiV3].join(
  '/'
);
export const baseUrlApiV4 = [environment.tmdbBaseUrl, environment.apiV4].join(
  '/'
);
