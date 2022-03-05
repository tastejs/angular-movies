import { Observable } from 'rxjs';
import { TMDBPersonModel } from '../model/person.model';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';
import { TMDBAppendOptions } from './model/append-options';

export type PersonResponse = TMDBPersonModel;

const URL_PERSON = (id: string) => `${[baseUrlApiV3, 'person', id].join('/')}`;

export const getPerson = (
  id: string,
  params: TMDBAppendOptions = { append_to_response: 'videos' }
): Observable<PersonResponse> => {
  return getHTTP().get<PersonResponse>(URL_PERSON(id), { params });
};
