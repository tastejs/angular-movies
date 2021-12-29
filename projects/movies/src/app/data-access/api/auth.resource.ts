import { Observable } from 'rxjs';
import { baseUrlApiV4, getHTTP } from './utils';

const baseUrl = [baseUrlApiV4, 'auth'].join('/');
const URL_REQUEST_TOKEN = [baseUrl, 'request_token'].join('/');
const URL_ACCESS_TOKEN = [baseUrl, 'access_token'].join('/');

export const createRequestToken = (redirectTo: string): Observable<any> => {
  return getHTTP().post<any>(URL_REQUEST_TOKEN, {
    redirect_to: redirectTo
  });
};

export const createAccessToken = (requestToken: string): Observable<any> =>
  getHTTP().post<any>(URL_ACCESS_TOKEN, { request_token: requestToken });

export const deleteAccessToken = (accessToken: string): Observable<any> =>
  getHTTP().delete<any>(URL_ACCESS_TOKEN, {
    body: { access_token: accessToken }
  });
