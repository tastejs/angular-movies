import { Observable } from 'rxjs';
import { baseUrlApiV4 } from './base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';

type Token = {
  request_token: string;
  access_token: string;
  account_id: string;
};

const baseUrl = [baseUrlApiV4, 'auth'].join('/');
const URL_REQUEST_TOKEN = [baseUrl, 'request_token'].join('/');
const URL_ACCESS_TOKEN = [baseUrl, 'access_token'].join('/');

export const createRequestToken = (redirectTo: string): Observable<Token> => {
  return getHTTP().post<any>(URL_REQUEST_TOKEN, {
    redirect_to: redirectTo,
  });
};

export const createAccessToken = (requestToken: string): Observable<Token> =>
  getHTTP().post<any>(URL_ACCESS_TOKEN, { request_token: requestToken });

export const deleteAccessToken = (accessToken: string): Observable<Token> =>
  getHTTP().delete<any>(URL_ACCESS_TOKEN, {
    body: { access_token: accessToken },
  });
