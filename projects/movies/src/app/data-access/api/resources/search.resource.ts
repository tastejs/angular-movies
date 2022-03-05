import { Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { baseUrlApiV3 } from './internal/base-urls.constant';

export type TMDBSearchOptions = TMDBPaginateOptions & {
  lang?: string;
};

const URL_SEARCH = [baseUrlApiV3, 'search', 'movie'].join('/');
export const getSearch = (
  query: string,
  params: TMDBSearchOptions = {} as TMDBPaginateOptions
): Observable<TMDBPaginateResult<TMDBMovieModel>> =>
  getHTTP().get<TMDBPaginateResult<TMDBMovieModel>>(URL_SEARCH, {
    params: { query, ...params },
  });
