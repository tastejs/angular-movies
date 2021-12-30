import { HttpClient } from '@angular/common/http';
import { getInjector } from './root-injector.module';

let _http: HttpClient;

export function getHTTP() {
  return _http || (_http = getInjector().get(HttpClient));
}
