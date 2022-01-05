import { map, Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import {
  getTMDBPaginationOptions,
  serverToClientPaginatedResult,
} from '../pagination/utils';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginatedResult,
  TMDBPaginationOptions,
} from '../pagination/pagination.interface';
import { PaginatedResult } from '../../../shared/state/typings';
import { TMDBMovieCreditsModel } from '../model/movie-credits.model';
import { baseUrlApiV3 } from '../constants';

const resource = 'movie';
const base = [baseUrlApiV3, resource].join('/');

const URL_MOVIE = (id: string) => `${[base, id].join('/')}`;
const URL_MOVIE_RECOMMENDATIONS = (id: string) =>
  [URL_MOVIE(id), 'recommendations'].join('/');
const URL_MOVIE_CREDITS = (id: string) => [base, id, 'credits'].join('/');
const URL_MOVIE_CATEGORY = (category: string) => [base, category].join('/');

export const getMovie = (
  id: string,
  options = { params: { append_to_response: 'videos' } }
): Observable<TMDBMovieModel> =>
  getHTTP().get<TMDBMovieModel>(URL_MOVIE(id), options);

export const getCredits = (id: string): Observable<TMDBMovieCreditsModel> =>
  getHTTP().get<TMDBMovieCreditsModel>(URL_MOVIE_CREDITS(id));

export const getMovieCategory = (
  category: string,
  options: TMDBPaginationOptions = {} as TMDBPaginationOptions
): Observable<PaginatedResult<TMDBMovieModel>> => {
  options = getTMDBPaginationOptions(options);
  return getHTTP()
    .get<TMDBPaginatedResult<TMDBMovieModel>>(URL_MOVIE_CATEGORY(category), {
      params: options,
    })
    .pipe(map(serverToClientPaginatedResult));
};

export const getMoviesRecommendations = (
  id: string,
  options: TMDBPaginationOptions = {} as TMDBPaginationOptions
): Observable<PaginatedResult<TMDBMovieModel>> => {
  options = getTMDBPaginationOptions(options);
  return getHTTP()
    .get<TMDBPaginatedResult<TMDBMovieModel>>(URL_MOVIE_RECOMMENDATIONS(id), {
      params: options,
    })
    .pipe(map(serverToClientPaginatedResult));
};
