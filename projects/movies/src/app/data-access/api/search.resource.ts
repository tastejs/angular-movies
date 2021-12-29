import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3, getHTTP } from './utils';

const URL_SEARCH = [baseUrlApiV3, 'search', 'movie'].join('/');
export const getMoviesSearch = (
  query: string,
  page: string | number = 1,
  lang?: string
): Observable<{ results: MovieModel[] }> => getHTTP().get<{ results: MovieModel[] }>(URL_SEARCH, {
  params: { query, page, ...(lang && { lang }) }
});

