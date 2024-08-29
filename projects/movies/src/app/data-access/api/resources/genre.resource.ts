import { map, Observable } from 'rxjs';
import { TMDBMovieGenreModel } from '../model/movie-genre.model';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { staticRequest } from '../staticRequest';
import { toDictionary } from '@rx-angular/cdk/transformations';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type GenresResponse = TMDBMovieGenreModel[];
type GenresServerResponse = { genres: GenresResponse };

const URL_GENRE_MOVIE_LIST = [baseUrlApiV3, 'genre', 'movie', 'list'].join('/');

@Injectable({
  providedIn: 'root',
})
export class GenreResource {
  private readonly http: HttpClient = inject(HttpClient);

  getGenres = (): Observable<GenresResponse> =>
    this.http
      .get<GenresServerResponse>(URL_GENRE_MOVIE_LIST)
      .pipe(map(({ genres }) => genres));

  getGenresCached = staticRequest(this.getGenres);

  getGenresDictionaryCached() {
    return this.getGenresCached().pipe(
      map((i: TMDBMovieGenreModel[]) => toDictionary(i, 'id')),
    ) as unknown as Observable<{
      [key: string]: TMDBMovieGenreModel;
    }>;
  }
}
