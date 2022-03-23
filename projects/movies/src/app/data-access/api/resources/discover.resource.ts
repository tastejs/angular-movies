import { TMDBMovieModel } from '../model/movie.model';
import { getTMDBPaginateOptions } from '../paginate/utils';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { Observable } from 'rxjs';
import { TMDBSortOptions } from '../sort/sort.interface';
import { getTMDBSortOptions } from '../sort/utils';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const URL_DISCOVER_MOVIE = [baseUrlApiV3, 'discover', 'movie'].join('/');

export type TMDBDiscoverOptions = TMDBPaginateOptions &
  TMDBSortOptions & {
    with_cast?: string;
    with_genres?: string;
  };

export type TMDBDiscoverResponse = TMDBSortOptions &
  TMDBPaginateResult<TMDBMovieModel>;

function getTMDBDiscoverOptions(options: any): TMDBDiscoverOptions {
  const { with_cast, with_genres, ...tmdbOptions } = options;
  const discoverOptions = {
    ...getTMDBPaginateOptions(tmdbOptions),
    ...getTMDBSortOptions(tmdbOptions),
  };
  with_cast && (discoverOptions.with_cast = with_cast);
  with_genres && (discoverOptions.with_genres = with_genres);
  return discoverOptions;
}

@Injectable({
  providedIn: 'root',
})
export class DiscoverResource {
  constructor(private http: HttpClient) {}

  /**
   * This endpoint returns related movies for genres and cast actors
   * @param discoverOptions
   */
  getDiscoverMovies = (
    discoverOptions: TMDBDiscoverOptions = {} as TMDBDiscoverOptions
  ): Observable<TMDBDiscoverResponse> =>
    this.http.get<TMDBDiscoverResponse>(URL_DISCOVER_MOVIE, {
      params: getTMDBDiscoverOptions(discoverOptions),
    });
}
