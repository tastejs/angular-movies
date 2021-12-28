import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class SearchResource {
  constructor(private http: HttpClient) {
  }

  private readonly apiVersion = environment.tmdbApiVersion;
  private readonly baseUrl = [environment.tmdbBaseUrl, this.apiVersion].join('/');

  private readonly URL_SEARCH = [this.baseUrl, 'search', 'movie'].join('/');

  getMovies = (
    query: string,
    page: string | number = 1,
    lang?: string
  ): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_SEARCH, {
      params: { query, page, ...(lang && { lang }) }
    });

}
