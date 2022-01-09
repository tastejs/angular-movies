import { Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { baseUrlApiV3 } from './base-urls.constant';

const URL_SEARCH = [baseUrlApiV3, 'search', 'movie'].join('/');
export const getSearch = (
  query: string,
  options: TMDBPaginateOptions & {
    lang?: string;
  } = {} as TMDBPaginateOptions
): Observable<TMDBPaginateResult<TMDBMovieModel>> =>
  getHTTP().get<TMDBPaginateResult<TMDBMovieModel>>(URL_SEARCH, {
    params: { query, ...options },
  });
