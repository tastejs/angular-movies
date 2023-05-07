import { Observable } from 'rxjs';
import { TMDBMovieModel } from '../model/movie.model';
import {
  TMDBPaginateResult,
  TMDBPaginateOptions,
} from '../paginate/paginate.interface';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type TMDBSearchOptions = TMDBPaginateOptions & {
  lang?: string;
};

const URL_SEARCH = [baseUrlApiV3, 'search', 'movie'].join('/');

@Injectable({
  providedIn: 'root',
})
export class SearchResource {
  private readonly http: HttpClient = inject(HttpClient);

  getSearch = (
    query: string,
    params: TMDBSearchOptions = {} as TMDBPaginateOptions
  ): Observable<TMDBPaginateResult<TMDBMovieModel>> =>
    this.http.get<TMDBPaginateResult<TMDBMovieModel>>(URL_SEARCH, {
      params: { query, ...params },
    });
}
