import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3, getTMDBPaginationOptions, serverToClientPaginatedResult } from './utils';
import { getHTTP } from '../../shared/injector/get-http-client';
import { TMDBPaginatedResult, TMDBPaginationOptions } from '../model/pagination.interface';
import { map, Observable } from 'rxjs';
import { PaginatedResult } from '../../shared/state/typings';

const URL_DISCOVER_MOVIE = [baseUrlApiV3, 'discover', 'movie'].join('/');

export const getDiscoverMovies = (with_case: string, options: TMDBPaginationOptions = {} as TMDBPaginationOptions): Observable<PaginatedResult<MovieModel>> => {
  options = getTMDBPaginationOptions(options);
  return getHTTP()
    .get<TMDBPaginatedResult<MovieModel>>(URL_DISCOVER_MOVIE, { params: { ...options, with_case } })
    .pipe(map(serverToClientPaginatedResult));
};
