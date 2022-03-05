import { environment } from '../../../../../environments/environment';

const { tmdbBaseUrl, apiV3, apiV4 } = environment;
export const baseUrlApiV3 = [tmdbBaseUrl, apiV3].join('/');
export const baseUrlApiV4 = [tmdbBaseUrl, apiV4].join('/');
