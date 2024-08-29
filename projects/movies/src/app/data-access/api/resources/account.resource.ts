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
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

const URL_ACCOUNT_LIST = (uid: string) =>
  [baseUrlApiV4, 'account', uid, 'lists'].join('/');

function getTMDBAcountListOptions(
  options: TMDBPaginateOptions,
): TMDBDiscoverOptions {
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
  private readonly http: HttpClient = inject(HttpClient);
  getAccountList = (
    accountId: string,
    params: TMDBPaginateOptions = {} as TMDBPaginateOptions,
  ): Observable<TMDBAccountListResponse> => {
    return this.http.get<TMDBAccountListResponse>(URL_ACCOUNT_LIST(accountId), {
      params: new HttpParams({
        fromObject: getTMDBAcountListOptions(params) as Record<string, string>,
      }),
    });
  };
}
