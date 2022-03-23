import { getTMDBPaginateOptions } from '../paginate/utils';
import {
  TMDBPaginateOptions,
  TMDBPaginateResult,
} from '../paginate/paginate.interface';
import { Observable } from 'rxjs';
import { TMDBAccountList } from '../model/list.model';
import { baseUrlApiV4 } from './internal/base-urls.constant';
import { getTMDBSortOptions } from '../sort/utils';
import { TMDBDiscoverOptions } from './discover.resource';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class AccountResource {
  constructor(private http: HttpClient) {}
  getAccountList = (
    accountId: string,
    params: TMDBPaginateOptions = {} as TMDBPaginateOptions
  ): Observable<TMDBAccountListResponse> => {
    params = getTMDBAcountListOptions(params);
    return this.http.get<TMDBAccountListResponse>(URL_ACCOUNT_LIST(accountId), {
      params,
    });
  };
}
