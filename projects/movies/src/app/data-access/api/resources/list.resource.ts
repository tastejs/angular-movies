import { map, Observable } from 'rxjs';
import { baseUrlApiV4 } from './internal/base-urls.constant';
import {
  TMDBAddMovieToListParams,
  TMDBListCreateUpdateParams,
  TMDBListModel,
} from '../model/list.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type ListCreateResponse = { id: number };

const URL_LIST_BASE = [baseUrlApiV4, 'list'].join('/');
const URL_EXISTING_LIST = (id: number) => [URL_LIST_BASE, id].join('/');
const URL_ADD_MOVIE_TO_LIST = (id: number) =>
  [URL_EXISTING_LIST(id), 'items'].join('/');

@Injectable({
  providedIn: 'root',
})
export class ListResource {
  private readonly http: HttpClient = inject(HttpClient);

  createList = (params: TMDBListCreateUpdateParams): Observable<number> =>
    this.http
      .post<ListCreateResponse>(URL_LIST_BASE, params)
      .pipe(map(({ id }) => id));

  fetchList = (id: string): Observable<Record<string, TMDBListModel>> =>
    this.http
      .get<TMDBListModel>(URL_EXISTING_LIST(+id))
      .pipe(map((list) => ({ [id]: list })));

  updateList = (params: TMDBListCreateUpdateParams) =>
    this.http.put(URL_EXISTING_LIST(params.id || 0), params);

  addMovieToList = (params: TMDBAddMovieToListParams) =>
    this.http.post(URL_ADD_MOVIE_TO_LIST(params.id), params);
  deleteMovieFromList = (params: TMDBAddMovieToListParams) =>
    this.http.delete(URL_ADD_MOVIE_TO_LIST(params.id), { body: params });

  deleteList = (id: string) => this.http.delete(URL_EXISTING_LIST(+id));
}
