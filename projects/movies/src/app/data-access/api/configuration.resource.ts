import { Observable } from 'rxjs';
import { Configuration } from './configuration.interface';
import { baseUrlApiV3, getHTTP } from './utils';

const URL_CONFIGURATION = [baseUrlApiV3, 'configuration'].join('/');
export const getConfig = (): Observable<Configuration> =>
  getHTTP().get<Configuration>(URL_CONFIGURATION);
