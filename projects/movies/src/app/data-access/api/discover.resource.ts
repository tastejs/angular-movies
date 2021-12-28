import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';
import { baseUrlApiV3 } from './utils';

@Injectable({
  providedIn: 'root'
})
export class DiscoverResource {
  constructor(private http: HttpClient) {
  }

  private readonly baseUrl = baseUrlApiV3;
  private readonly URL_DISCOVER_MOVIE = [this.baseUrl, 'discover', 'movie'].join('/');

  getDiscoverMovies = (id: string, page: string = '1', sortBy: string = 'popularity.desc'): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_DISCOVER_MOVIE, {
      params: { page, sort_by: sortBy, with_case: id }
    });

}
