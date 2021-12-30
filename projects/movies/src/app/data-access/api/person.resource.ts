import { Observable } from 'rxjs';
import { MoviePersonModel } from '../model/movie-person.model';
import { baseUrlApiV3, getHTTP } from './utils';

const URL_PERSON = (id: string) => `${[baseUrlApiV3, 'person', id].join('/')}?append_to_response=videos`;
export const getPerson = (id: string): Observable<MoviePersonModel> => {
  return getHTTP().get<MoviePersonModel>(URL_PERSON(id), { params: {} });
};

