import { map, Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3, getTMDBPaginationOptions, serverToClientPaginatedResult } from './utils';
import { getHTTP } from '../../shared/injector/get-http-client';
import { TMDBPaginatedResult, TMDBPaginationOptions } from '../model/pagination.interface';
import { PaginatedResult } from '../../shared/state/typings';

const resource = 'movie';
const base = [baseUrlApiV3, resource].join('/');

const URL_MOVIE = (id: string) => `${[base, id].join('/')}`;
const URL_MOVIE_RECOMMENDATIONS = (id: string) => [URL_MOVIE(id), 'recommendations'].join('/');
const URL_MOVIE_CREDITS = (id: string) => [base, id, 'credits'].join('/');
const URL_MOVIE_CATEGORY = (category: string) => [base, category].join('/');

export const getMovie = (id: string, options = { params: { append_to_response: 'videos' } }): Observable<MovieModel> =>
  getHTTP().get<MovieModel>(URL_MOVIE(id), options);

export const getCredits = (id: string): Observable<any> =>
  getHTTP().get<any>(URL_MOVIE_CREDITS(id));

export const getMovieCategory = (
  category: string,
  options: TMDBPaginationOptions = {} as TMDBPaginationOptions
): Observable<PaginatedResult<MovieModel>> => {
  console.log('in http category:', category, ' options:', options);
  options = getTMDBPaginationOptions(options);
  return getHTTP()
    .get<TMDBPaginatedResult<MovieModel>>(URL_MOVIE_CATEGORY(category), { params: options })
    .pipe(map(serverToClientPaginatedResult));
};

export const getMoviesRecommendations = (
  id: string,
  options: TMDBPaginationOptions = {} as TMDBPaginationOptions
): Observable<PaginatedResult<MovieModel>> => {
  options = getTMDBPaginationOptions(options);
  return getHTTP()
    .get<TMDBPaginatedResult<MovieModel>>(URL_MOVIE_RECOMMENDATIONS(id), { params: options })
    .pipe(map(serverToClientPaginatedResult));
};
