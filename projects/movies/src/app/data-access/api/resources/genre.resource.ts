import { map, Observable } from 'rxjs';
import { TMDBMovieGenreModel } from '../model/movie-genre.model';
import { baseUrlApiV3 } from '../constants';
import { getHTTP } from '../../../shared/injector/get-http-client';

const URL_GENRE_MOVIE_LIST = [baseUrlApiV3, 'genre', 'movie', 'list'].join('/');
export const getGenres = (): Observable<TMDBMovieGenreModel[]> =>
  getHTTP()
    .get<{ genres: TMDBMovieGenreModel[] }>(URL_GENRE_MOVIE_LIST)
    .pipe(map(({ genres }) => genres));
