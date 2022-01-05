import { Observable } from 'rxjs';
import { TMDBMoviePersonModel } from '../model/movie-person.model';
import { baseUrlApiV3 } from '../constants';
import { getHTTP } from '../../../shared/injector/get-http-client';

const URL_PERSON = (id: string) =>
  `${[baseUrlApiV3, 'person', id].join('/')}?append_to_response=videos`;
export const getPerson = (id: string): Observable<TMDBMoviePersonModel> => {
  return getHTTP().get<TMDBMoviePersonModel>(URL_PERSON(id), { params: {} });
};
