import { Observable } from 'rxjs';
import { TMDBPersonModel } from '../model/person.model';
import { baseUrlApiV3 } from './base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';

export type PersonResponse = TMDBPersonModel;

const URL_PERSON = (id: string) =>
  `${[baseUrlApiV3, 'person', id].join('/')}?append_to_response=videos`;
export const getPerson = (id: string): Observable<PersonResponse> => {
  return getHTTP().get<PersonResponse>(URL_PERSON(id), { params: {} });
};
