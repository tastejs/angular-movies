import { Observable } from 'rxjs';
import { TMDBConfigurationModel } from '../model/configuration.model';
import { baseUrlApiV3 } from './base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';

const URL_CONFIGURATION = [baseUrlApiV3, 'configuration'].join('/');

export const getConfig = (): Observable<TMDBConfigurationModel> =>
  getHTTP().get<TMDBConfigurationModel>(URL_CONFIGURATION);
