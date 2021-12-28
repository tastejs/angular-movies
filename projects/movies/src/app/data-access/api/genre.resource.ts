import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MovieGenreModel } from '../model/movie-genre.model';
import { baseUrlApiV3 } from './utils';

@Injectable({
  providedIn: 'root'
})
export class GenreResource {
  constructor(private http: HttpClient) {
  }

  private readonly baseUrl = baseUrlApiV3;
  private readonly URL_GENRE_MOVIE_LIST = [this.baseUrl, 'genre', 'movie', 'list'].join('/');

  getGenres = (): Observable<MovieGenreModel[]> =>
    this.http
      .get<{ genres: MovieGenreModel[] }>(this.URL_GENRE_MOVIE_LIST)
      .pipe(map(({ genres }) => genres));
}
