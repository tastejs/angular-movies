import { getTMDBPaginateOptions } from '../paginate/utils';
import { getHTTP } from '../../../shared/injector/get-http-client';
import {
  TMDBPaginateOptions,
  TMDBPaginateResult,
} from '../paginate/paginate.interface';
import { Observable } from 'rxjs';
import { TMDBAccountList } from '../model/list.model';
import { baseUrlApiV4 } from './internal/base-urls.constant';
import { getTMDBSortOptions } from '../sort/utils';
import { TMDBDiscoverOptions } from './discover.resource';

const URL_ACCOUNT_LIST = (uid: string) =>
  [baseUrlApiV4, 'account', uid, 'lists'].join('/');

function getTMDBAcountListOptions(options: any): TMDBDiscoverOptions {
  const discoverOptions = {
    ...getTMDBPaginateOptions(options),
    ...getTMDBSortOptions(options),
  };
  return discoverOptions;
}

export type TMDBAccountListResponse = TMDBPaginateResult<TMDBAccountList>;
export const getAccountList = (
  accountId: string,
  params: TMDBPaginateOptions = {} as TMDBPaginateOptions
): Observable<TMDBAccountListResponse> => {
  params = getTMDBAcountListOptions(params);
  return getHTTP().get<TMDBAccountListResponse>(URL_ACCOUNT_LIST(accountId), {
    params,
  });
};
