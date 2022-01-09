import { TMDBMovieModel } from '../model/movie.model';
import { getTMDBPaginateOptions } from '../paginate/utils';
import { baseUrlApiV3 } from './base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { Observable } from 'rxjs';
import { TMDBSortOptions } from '../sort/sort.interface';

const URL_DISCOVER_MOVIE = [baseUrlApiV3, 'discover', 'movie'].join('/');

export type TMDBDiscoverOptions = TMDBPaginateOptions & {
  with_cast?: string;
  with_genres?: string;
};

export type TMDBDiscoverResponse = TMDBSortOptions &
  TMDBPaginateResult<TMDBMovieModel>;

function getTMDBDiscoverOptions(options: any): TMDBDiscoverOptions {
  const { with_cast, with_genres, ...tmdbOptions } = options;
  const discoverOptions = getTMDBPaginateOptions(tmdbOptions);
  with_cast && (discoverOptions.with_cast = with_cast);
  with_genres && (discoverOptions.with_genres = with_genres);
  return discoverOptions;
}

/**
 * This endpoint returns related movies for genres and cast actors
 * @param discoverOptions
 */
export const getDiscoverMovies = (
  discoverOptions: TMDBDiscoverOptions = {} as TMDBDiscoverOptions
): Observable<TMDBDiscoverResponse> =>
  getHTTP().get<TMDBDiscoverResponse>(URL_DISCOVER_MOVIE, {
    params: getTMDBDiscoverOptions(discoverOptions),
  });
