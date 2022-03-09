import { map, Observable } from 'rxjs';
import { TMDBMovieGenreModel } from '../model/movie-genre.model';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';
import { staticRequest } from '../staticRequest';
import { toDictionary } from '@rx-angular/cdk/transformations';

export type GenresResponse = TMDBMovieGenreModel[];
type GenresServerResponse = { genres: GenresResponse };

const URL_GENRE_MOVIE_LIST = [baseUrlApiV3, 'genre', 'movie', 'list'].join('/');

export const getGenres = (): Observable<GenresResponse> =>
  getHTTP()
    .get<GenresServerResponse>(URL_GENRE_MOVIE_LIST)
    .pipe(map(({ genres }) => genres));

export const getGenresCached = staticRequest(getGenres);

export const getGenresDictionaryCached = () =>
  getGenresCached().pipe(
    map((i: TMDBMovieGenreModel[]) => toDictionary(i, 'id'))
  ) as any as Observable<{
    [key: string]: TMDBMovieGenreModel;
  }>;
