import { TMDBMovieModel } from '../model/movie.model';
import {
  getTMDBPaginationOptions,
  serverToClientPaginatedResult,
} from '../pagination/utils';
import { baseUrlApiV4 } from '../constants';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginatedResult,
  TMDBPaginationOptions,
} from '../pagination/pagination.interface';
import { map, Observable } from 'rxjs';
import { PaginatedResult } from '../../../shared/state/typings';
import { TMDBAccountList } from '../model/account-list.interface';

const URL_ACCOUNT_LIST = (uid: string) =>
  [baseUrlApiV4, 'account', uid, 'lists'].join('/');

export const getAccountList = (
  accountId: string,
  listOptions: TMDBPaginationOptions = {} as TMDBPaginationOptions
): Observable<PaginatedResult<TMDBAccountList>> => {
  return getHTTP()
    .get<TMDBPaginatedResult<TMDBMovieModel>>(URL_ACCOUNT_LIST(accountId), {
      params: getTMDBPaginationOptions(listOptions),
    })
    .pipe(map(serverToClientPaginatedResult));
};
