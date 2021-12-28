import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3 } from './utils';

@Injectable({
  providedIn: 'root'
})
export class MovieResource {
  constructor(private http: HttpClient) {
  }

  private readonly baseUrl = baseUrlApiV3;

  private readonly URL_MOVIE = (id: string) =>
    `${[this.baseUrl, 'movie', id].join('/')}?append_to_response=videos`;
  private readonly URL_MOVIE_RECOMMENDATIONS = (id: string) =>
    [this.baseUrl, 'movie', id, 'recommendations'].join('/');
  private readonly URL_MOVIE_CREDITS = (id: string) =>
    [this.baseUrl, 'movie', id, 'credits'].join('/');
  private readonly URL_MOVIE_CATEGORY = (category: string) =>
    [this.baseUrl, 'movie', category].join('/');

  getMovie = (id: string): Observable<MovieModel> =>
    this.http.get<MovieModel>(this.URL_MOVIE(id));

  getCredits = (id: string): Observable<any> =>
    this.http.get<any>(this.URL_MOVIE_CREDITS(id));

  getMovieCategory = (
    category: string
  ): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_MOVIE_CATEGORY(category));

  getMovieRecomendations = (id: string): Observable<MovieModel[]> =>
    this.http.get<MovieModel[]>(this.URL_MOVIE_RECOMMENDATIONS(id));

  getMoviesRecommendations = (
    id: string,
    page: string
  ): Observable<MovieModel> =>
    this.http.get<MovieModel>(
      [this.URL_MOVIE, id, 'recommendations'].join('/'),
      { params: { page } }
    );

}
