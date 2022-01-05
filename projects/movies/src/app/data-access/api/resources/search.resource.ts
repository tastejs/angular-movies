import { map, Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import { serverToClientPaginatedResult } from '../pagination/utils';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginatedResult,
  TMDBPaginationOptions,
} from '../pagination/pagination.interface';
import { PaginatedResult } from '../../../shared/state/typings';
import { baseUrlApiV3 } from '../constants';

const URL_SEARCH = [baseUrlApiV3, 'search', 'movie'].join('/');
export const getSearch = (
  query: string,
  options: TMDBPaginationOptions & {
    lang?: string;
  } = {} as TMDBPaginationOptions
): Observable<PaginatedResult<TMDBMovieModel>> =>
  getHTTP()
    .get<TMDBPaginatedResult<TMDBMovieModel>>(URL_SEARCH, {
      params: { query, ...options },
    })
    .pipe(map(serverToClientPaginatedResult));
