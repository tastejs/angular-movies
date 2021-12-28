import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieResource {
  constructor(private http: HttpClient) {
  }

  private readonly apiVersion = environment.tmdbApiVersion;
  private readonly baseUrl = [environment.tmdbBaseUrl, this.apiVersion].join('/');

  private readonly URL_MOVIE_GENRE = `${this.baseUrl}/discover/movie`;
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

  getMovieGenre = (
    genreId: string,
    page: string = '1',
    sortBy: string = 'popularity.desc'
  ): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_MOVIE_GENRE, {
      params: { with_genres: genreId, page, sort_by: sortBy }
    });

  getMoviesRecommendations = (
    id: string,
    page: string
  ): Observable<MovieModel> =>
    this.http.get<MovieModel>(
      [this.URL_MOVIE, id, 'recommendations'].join('/'),
      { params: { page } }
    );

}
