import { map, Observable } from 'rxjs';
import { baseUrlApiV4 } from './base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBAddMovieToListParams,
  TMDBListCreateUpdateParams,
  TMDBListModel,
} from '../model/list.model';

export type ListCreateResponse = { id: number };

const URL_LIST_BASE = [baseUrlApiV4, 'list'].join('/');
const URL_EXISTING_LIST = (id: number) => [URL_LIST_BASE, id].join('/');
const URL_ADD_MOVIE_TO_LIST = (id: number) =>
  [URL_EXISTING_LIST(id), 'items'].join('/');

export const createList = (
  params: TMDBListCreateUpdateParams
): Observable<number> =>
  getHTTP()
    .post<ListCreateResponse>(URL_LIST_BASE, params)
    .pipe(map(({ id }) => id));

export const fetchList = (
  id: string
): Observable<Record<string, TMDBListModel>> =>
  getHTTP()
    .get<TMDBListModel>(URL_EXISTING_LIST(+id))
    .pipe(map((list) => ({ [id]: list })));

export const updateList = (params: TMDBListCreateUpdateParams) =>
  getHTTP().put(URL_EXISTING_LIST(params.id || 0), params);

export const addMovieToList = (params: TMDBAddMovieToListParams) =>
  getHTTP().post(URL_ADD_MOVIE_TO_LIST(params.id), params);
export const deleteMovieFromList = (params: TMDBAddMovieToListParams) =>
  getHTTP().delete(URL_ADD_MOVIE_TO_LIST(params.id), { body: params });

export const deleteList = (id: string) =>
  getHTTP().delete(URL_EXISTING_LIST(+id));
