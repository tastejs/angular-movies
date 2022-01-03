import { TMDBMovieModel } from '../model/movie.model';
import {
  baseUrlApiV3,
  getTMDBPaginationOptions,
  serverToClientPaginatedResult,
} from '../utils';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginatedResult,
  TMDBPaginationOptions,
} from '../model/pagination.interface';
import { map, Observable } from 'rxjs';
import { PaginatedResult } from '../../../shared/state/typings';

const URL_DISCOVER_MOVIE = [baseUrlApiV3, 'discover', 'movie'].join('/');

export const getDiscoverMovies = (
  options: TMDBPaginationOptions & {
    with_case?: string;
    with_genres?: string;
  } = {} as TMDBPaginationOptions
): Observable<PaginatedResult<TMDBMovieModel>> => {
  options = getTMDBPaginationOptions(options);
  return getHTTP()
    .get<TMDBPaginatedResult<TMDBMovieModel>>(URL_DISCOVER_MOVIE, {
      params: options,
    })
    .pipe(map(serverToClientPaginatedResult));
};
