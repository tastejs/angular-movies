import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieGenreModel } from '../model/movie-genre.model';
import { MovieModel } from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class GenreResource {
  constructor(private http: HttpClient) {
  }

  private readonly apiVersion = environment.tmdbApiVersion;
  private readonly baseUrl = [environment.tmdbBaseUrl, this.apiVersion].join('/');

  private readonly URL_GENRE_MOVIE_LIST = [this.baseUrl, 'genre', 'movie', 'list'].join(
    '/'
  );
  private readonly URL_MOVIE_GENRE = `${this.baseUrl}/discover/movie`;
  getGenres = (): Observable<MovieGenreModel[]> =>
    this.http
      .get<{ genres: MovieGenreModel[] }>(this.URL_GENRE_MOVIE_LIST)
      .pipe(map(({ genres }) => genres));

  getMovieGenre = (
    genreId: string,
    page: string = '1',
    sortBy: string = 'popularity.desc'
  ): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_MOVIE_GENRE, {
      params: { with_genres: genreId, page, sort_by: sortBy }
    });

}
