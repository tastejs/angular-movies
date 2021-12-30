import { map, Observable } from 'rxjs';
import { MovieGenreModel } from '../model/movie-genre.model';
import { baseUrlApiV3 } from './utils';
import { getHTTP } from '../../shared/injector/get-http-client';

const URL_GENRE_MOVIE_LIST = [baseUrlApiV3, 'genre', 'movie', 'list'].join('/');
export const getGenres = (): Observable<MovieGenreModel[]> =>
  getHTTP()
    .get<{ genres: MovieGenreModel[] }>(URL_GENRE_MOVIE_LIST)
    .pipe(map(({ genres }) => genres));
