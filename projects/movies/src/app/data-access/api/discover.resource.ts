import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieModel } from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class DiscoverResource {
  constructor(private http: HttpClient) {
  }

  private readonly apiVersion = environment.tmdbApiVersion;
  private readonly baseUrl = [environment.tmdbBaseUrl, this.apiVersion].join('/');
  private readonly URL_DISCOVER_MOVIE = [this.baseUrl, 'discover', 'movie'].join('/');

  getDiscoverMovies = (id: string, page: string = '1', sortBy: string = ''): Observable<{ results: MovieModel[] }> =>
    this.http.get<{ results: MovieModel[] }>(this.URL_DISCOVER_MOVIE, {
      params: { page, sort_by: sortBy, with_case: id }
    });
}
