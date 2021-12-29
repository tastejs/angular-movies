import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { getInjector } from '../../shared/utils/injector.instance';

export const baseUrlApiV3 = [environment.tmdbBaseUrl, environment.apiV3].join('/');
export const baseUrlApiV4 = [environment.tmdbBaseUrl, environment.apiV4].join('/');

let _http: HttpClient;
export function getHTTP() {
  return _http || (_http = getInjector().get(HttpClient));
}
