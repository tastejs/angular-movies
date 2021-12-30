import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3, getHTTP } from './utils';

const resource = 'movie';
const base = [baseUrlApiV3, resource].join('/');

const URL_MOVIE = (id: string) => `${[base, id].join('/')}`;
const URL_MOVIE_RECOMMENDATIONS = (id: string) => [URL_MOVIE(id), 'recommendations'].join('/');
const URL_MOVIE_CREDITS = (id: string) => [base, id, 'credits'].join('/');
const URL_MOVIE_CATEGORY = (category: string) => [base, category].join('/');

export const getMovie = (id: string, options = { params: { append_to_response:'videos' } }): Observable<MovieModel> =>
  getHTTP().get<MovieModel>(URL_MOVIE(id), options );

export const getCredits = (id: string): Observable<any> =>
  getHTTP().get<any>(URL_MOVIE_CREDITS(id));

export const getMovieCategory = (
  category: string
): Observable<{ results: MovieModel[] }> =>
  getHTTP().get<{ results: MovieModel[] }>(URL_MOVIE_CATEGORY(category));

export const getMoviesRecommendations = (
  id: string,
  page: string = '1'
): Observable<MovieModel> =>
  getHTTP().get<MovieModel>(URL_MOVIE_RECOMMENDATIONS(id), { params: { page } });
