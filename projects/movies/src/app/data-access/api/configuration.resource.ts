import { Observable } from 'rxjs';
import { Configuration } from './configuration.interface';
import { baseUrlApiV3 } from './utils';
import { getHTTP } from '../../shared/injector/get-http-client';

const URL_CONFIGURATION = [baseUrlApiV3, 'configuration'].join('/');

export const getConfig = (): Observable<Configuration> => getHTTP().get<Configuration>(URL_CONFIGURATION);
