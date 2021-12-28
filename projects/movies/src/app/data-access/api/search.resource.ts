import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3 } from './utils';

@Injectable({
  providedIn: 'root'
})
export class SearchResource {
  private readonly baseUrl = baseUrlApiV3;
  private readonly URL_SEARCH = [this.baseUrl, 'search', 'movie'].join('/');

  constructor(private http: HttpClient) {
  }

  getMovies = (
    query: string,
    page: string | number = 1,
    lang?: string
  ): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_SEARCH, {
      params: { query, page, ...(lang && { lang }) }
    });

}
