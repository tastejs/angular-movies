import { map, Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import { getTMDBPaginateOptions } from '../paginate/utils';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { TMDBMovieCreditsModel } from '../model/movie-credits.model';
import { baseUrlApiV3 } from './base-urls.constant';

const base = [baseUrlApiV3, 'movie'].join('/');

const URL_MOVIE_CATEGORY = (category: string) => [base, category].join('/');
const URL_MOVIE = (id: string) => `${[base, id].join('/')}`;
const URL_MOVIE_CREDITS = (id: string) => [URL_MOVIE(id), 'credits'].join('/');
const URL_MOVIE_RECOMMENDATIONS = (id: string) =>
  [URL_MOVIE(id), 'recommendations'].join('/');
const URL_MOVIE_QUERY = (query: string) =>
  `${baseUrlApiV3}/search/movie?query=${query}`;

export type MovieResponse = TMDBMovieModel;
export const getMovie = (
  id: string,
  options = { params: { append_to_response: 'videos' } }
): Observable<MovieResponse> =>
  getHTTP().get<MovieResponse>(URL_MOVIE(id), options);

export type CreditsResponse = TMDBMovieCreditsModel;
export const getCredits = (id: string): Observable<CreditsResponse> =>
  getHTTP().get<CreditsResponse>(URL_MOVIE_CREDITS(id));

export type CategoryResponse = TMDBPaginateResult<TMDBMovieModel>;
export const getMovieCategory = (
  category: string,
  options: TMDBPaginateOptions = {} as TMDBPaginateOptions
): Observable<CategoryResponse> => {
  options = getTMDBPaginateOptions(options);
  return getHTTP().get<CategoryResponse>(URL_MOVIE_CATEGORY(category), {
    params: options,
  });
};

export type RecommendationsResponse = TMDBPaginateResult<TMDBMovieModel>;
export const getMoviesRecommendations = (
  id: string,
  options: TMDBPaginateOptions = {} as TMDBPaginateOptions
): Observable<RecommendationsResponse> => {
  options = getTMDBPaginateOptions(options);
  return getHTTP().get<RecommendationsResponse>(URL_MOVIE_RECOMMENDATIONS(id), {
    params: options,
  });
};

export const queryMovie = (query: string): Observable<MovieResponse[]> =>
  getHTTP()
    .get<{ results: MovieResponse[] }>(URL_MOVIE_QUERY(query))
    .pipe(map((res) => res.results));
