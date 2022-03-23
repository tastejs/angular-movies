import { map, Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import { getTMDBPaginateOptions } from '../paginate/utils';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { TMDBMovieCreditsModel } from '../model/movie-credits.model';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { TMDBAppendOptions } from './model/append-options';
import { TMDBDiscoverOptions } from './discover.resource';
import { getTMDBSortOptions } from '../sort/utils';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base = [baseUrlApiV3, 'movie'].join('/');

const URL_MOVIE_CATEGORY = (category: string) => [base, category].join('/');
const URL_MOVIE = (id: string) => `${[base, id].join('/')}`;
const URL_MOVIE_CREDITS = (id: string) => [URL_MOVIE(id), 'credits'].join('/');
const URL_MOVIE_RECOMMENDATIONS = (id: string) =>
  [URL_MOVIE(id), 'recommendations'].join('/');
const URL_MOVIE_QUERY = (query: string) =>
  `${baseUrlApiV3}/search/movie?query=${query}`;

export type MovieResponse = TMDBMovieModel;
export type RecommendationsResponse = TMDBPaginateResult<TMDBMovieModel>;

export type CreditsResponse = TMDBMovieCreditsModel;
export type CategoryResponse = TMDBPaginateResult<TMDBMovieModel>;

@Injectable({
  providedIn: 'root',
})
export class MovieResource {
  constructor(private http: HttpClient) {}
  getMoviesRecommendations = (
    id: string,
    params: TMDBPaginateOptions = {} as TMDBPaginateOptions
  ): Observable<RecommendationsResponse> => {
    params = getTMDBMovieOptions(params);
    return this.http.get<RecommendationsResponse>(
      URL_MOVIE_RECOMMENDATIONS(id),
      {
        params,
      }
    );
  };
  getMovie = (
    id: string,
    params: TMDBAppendOptions = { append_to_response: 'videos' }
  ): Observable<MovieResponse> =>
    this.http.get<MovieResponse>(URL_MOVIE(id), { params });

  getCredits = (id: string): Observable<CreditsResponse> =>
    this.http.get<CreditsResponse>(URL_MOVIE_CREDITS(id));

  getMovieCategory = (
    category: string,
    params: TMDBPaginateOptions = {} as TMDBPaginateOptions
  ): Observable<CategoryResponse> => {
    params = getTMDBMovieOptions(params);
    return this.http.get<CategoryResponse>(URL_MOVIE_CATEGORY(category), {
      params,
    });
  };

  queryMovie = (query: string): Observable<MovieResponse[]> =>
    this.http
      .get<{ results: MovieResponse[] }>(URL_MOVIE_QUERY(query))
      .pipe(map((res) => res.results));
}
function getTMDBMovieOptions(options: any): TMDBDiscoverOptions {
  const discoverOptions = {
    ...getTMDBPaginateOptions(options),
    ...getTMDBSortOptions(options),
  };
  return discoverOptions;
}
