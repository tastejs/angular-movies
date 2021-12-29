import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3, getHTTP } from './utils';

const resource = 'movie';
const URL_MOVIE = (id: string) =>
  `${[baseUrlApiV3, resource, id].join('/')}?append_to_response=videos`;
const URL_MOVIE_RECOMMENDATIONS = (id: string) =>
  [baseUrlApiV3, resource, id, 'recommendations'].join('/');
const URL_MOVIE_CREDITS = (id: string) =>
  [baseUrlApiV3, resource, id, 'credits'].join('/');
const URL_MOVIE_CATEGORY = (category: string) =>
  [baseUrlApiV3, resource, category].join('/');

export const getMovie = (id: string): Observable<MovieModel> =>
  getHTTP().get<MovieModel>(URL_MOVIE(id));

export const getCredits = (id: string): Observable<any> =>
  getHTTP().get<any>(URL_MOVIE_CREDITS(id));

export const getMovieCategory = (
  category: string
): Observable<{ results: MovieModel[] }> =>
  getHTTP().get<{ results: MovieModel[] }>(URL_MOVIE_CATEGORY(category));

export const getMovieRecomendations = (id: string): Observable<MovieModel[]> =>
  getHTTP().get<MovieModel[]>(URL_MOVIE_RECOMMENDATIONS(id));

export const getMoviesRecommendations = (
  id: string,
  page: string
): Observable<MovieModel> =>
  getHTTP().get<MovieModel>(
    [URL_MOVIE, id, 'recommendations'].join('/'),
    { params: { page } }
  );
