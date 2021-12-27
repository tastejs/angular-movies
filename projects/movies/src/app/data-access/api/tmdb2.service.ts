import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieGenreModel } from '../model/movie-genre.model';
import { MovieModel } from '../model/movie.model';
import { MoviePersonModel } from '../model/movie-person.model';
import { Configuration } from './configuration.interface';
import { MovieDatabaseModel } from '../model/movie-database.model';

@Injectable({
  providedIn: 'root'
})
export class Tmdb2Service {
  constructor(private http: HttpClient) {
  }

  private readonly apiVersion = environment.tmdbApiVersion;
  private readonly apiNewVersion = environment.tmdbApiNewVersion;
  private readonly baseUrl = [environment.tmdbBaseUrl, this.apiVersion].join('/');

  private readonly URL_REQUEST_TOKEN = [
    environment.tmdbBaseUrl,
    this.apiNewVersion,
    'auth',
    'request_token'
  ].join('/');
  private readonly URL_ACCESS_TOKEN = [
    environment.tmdbBaseUrl,
    this.apiNewVersion,
    'auth',
    'access_token'
  ].join('/');
  private readonly URL_LISTS = [
    environment.tmdbBaseUrl,
    this.apiNewVersion,
    'list'
  ].join('/');
  private readonly URL_CONFIGURATION = [this.baseUrl, 'configuration'].join('/');
  private readonly URL_SEARCH = [this.baseUrl, 'search', 'movie'].join('/');
  private readonly URL_GENRE_MOVIE_LIST = [this.baseUrl, 'genre', 'movie', 'list'].join(
    '/'
  );
  private readonly URL_MOVIE_GENRE = `${this.baseUrl}/discover/movie`;
  private readonly URL_MOVIE = (id: string) =>
    `${[this.baseUrl, 'movie', id].join('/')}?append_to_response=videos`;
  private readonly URL_PERSON = (id: string) =>
    `${[this.baseUrl, 'person', id].join('/')}?append_to_response=videos`;
  private readonly URL_MOVIE_RECOMMENDATIONS = (id: string) =>
    [this.baseUrl, 'movie', id, 'recommendations'].join('/');
  private readonly URL_MOVIE_CREDITS = (id: string) =>
    [this.baseUrl, 'movie', id, 'credits'].join('/');
  private readonly URL_MOVIE_CATEGORY = (category: string) =>
    [this.baseUrl, 'movie', category].join('/');
  private readonly URL_DISCOVER = () =>
    [this.baseUrl, 'discover', 'movie'].join('/');

  createRequestToken(redirectTo: string): Observable<any> {
    return this.http.post<any>(this.URL_REQUEST_TOKEN, {
      redirect_to: redirectTo
    });
  }

  createAccessToken = (requestToken: string): Observable<any> =>
    this.http.post<any>(this.URL_ACCESS_TOKEN, { request_token: requestToken });

  deleteAccessToken = (accessToken: string): Observable<any> =>
    this.http.delete<any>(this.URL_ACCESS_TOKEN, {
      body: { access_token: accessToken }
    });

  getConfig = (): Observable<Configuration> =>
    this.http.get<Configuration>(this.URL_CONFIGURATION);

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

  getPersonMovies = (id: string, page: string = '1', sortBy: string = ''): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_DISCOVER(), {
      params: { page, sort_by: sortBy, with_case:id }
    });

  getPerson = (id: string): Observable<MoviePersonModel> =>
    this.http.get<MoviePersonModel>(this.URL_PERSON(id), { params: {  } });

  getMovies = (
    query: string,
    page: string | number = 1,
    lang?: string
  ): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_SEARCH, {
      params: { query, page, ...(lang && { lang }) }
    });

  getMoviesRecommendations = (
    id: string,
    page: string
  ): Observable<MovieModel> =>
    this.http.get<MovieModel>(
      [this.URL_MOVIE, id, 'recommendations'].join('/'),
      { params: { page } }
    );

  getLists = (): Observable<MovieDatabaseModel[]> =>
    this.http.get<MovieDatabaseModel[]>(this.URL_LISTS);

  getPager(totalPages: number, currentPage: number = 1) {
    let startPage = 0;
    let endPage = 0;
    if (totalPages >= 1000) {
      totalPages = 1000;
    }
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else if (currentPage >= 1000) {
        startPage = currentPage - 5;
        currentPage = 1000;
        totalPages = 1000;
        endPage = 1000;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = new Array(startPage, currentPage, endPage);

    // return object with all pager properties required by the view
    return {
      currentPage,
      totalPages,
      startPage,
      endPage,
      pages
    };
  }
}
