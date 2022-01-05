import { TMDBMovieModel } from '../model/movie.model';
import {
  getTMDBPaginationOptions,
  serverToClientPaginatedResult,
} from '../pagination/utils';
import { baseUrlApiV3 } from '../constants';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginatedResult,
  TMDBPaginationOptions,
} from '../pagination/pagination.interface';
import { map, Observable } from 'rxjs';
import { PaginatedResult } from '../../../shared/state/typings';

const URL_DISCOVER_MOVIE = [baseUrlApiV3, 'discover', 'movie'].join('/');

export type TMDBDiscoverOptions = TMDBPaginationOptions & {
  with_cast?: string;
  with_genres?: string;
};

function getTMDBDiscoverOptions(options: any): TMDBDiscoverOptions {
  const { with_cast, with_genres, ...tmdbOptions } = options;
  const discoverOptions = getTMDBPaginationOptions(tmdbOptions);
  with_cast && (discoverOptions.with_cast = with_cast);
  with_genres && (discoverOptions.with_genres = with_genres);
  return discoverOptions;
}

export const getDiscoverMovies = (
  discoverOptions: TMDBDiscoverOptions = {} as TMDBDiscoverOptions
): Observable<PaginatedResult<TMDBMovieModel>> => {
  discoverOptions = getTMDBDiscoverOptions(discoverOptions);
  return getHTTP()
    .get<TMDBPaginatedResult<TMDBMovieModel>>(URL_DISCOVER_MOVIE, {
      params: discoverOptions,
    })
    .pipe(map(serverToClientPaginatedResult));
};
