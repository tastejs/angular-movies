import { getTMDBPaginateOptions } from '../paginate/utils';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateOptions,
  TMDBPaginateResult,
} from '../paginate/paginate.interface';
import { Observable } from 'rxjs';
import { TMDBAccountList } from '../model/account-list.interface';
import { baseUrlApiV4 } from './base-urls.constant';

const URL_ACCOUNT_LIST = (uid: string) =>
  [baseUrlApiV4, 'account', uid, 'lists'].join('/');

export type TMDBAccountListResponse = TMDBPaginateResult<TMDBAccountList>;
export const getAccountList = (
  accountId: string,
  listOptions: TMDBPaginateOptions = {} as TMDBPaginateOptions
): Observable<TMDBAccountListResponse> => {
  return getHTTP().get<TMDBAccountListResponse>(URL_ACCOUNT_LIST(accountId), {
    params: getTMDBPaginateOptions(listOptions),
  });
};
