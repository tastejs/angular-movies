import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3, getHTTP } from './utils';

const URL_DISCOVER_MOVIE = [baseUrlApiV3, 'discover', 'movie'].join('/');

export const getDiscoverMovies = (id: string, page: string = '1', sortBy: string = 'popularity.desc'): Observable<{ results: MovieModel[] }> =>
  getHTTP().get<{ results: MovieModel[] }>(URL_DISCOVER_MOVIE, {
    params: { page, sort_by: sortBy, with_case: id }
  });
