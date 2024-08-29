import { Observable } from 'rxjs';
import { baseUrlApiV4 } from './internal/base-urls.constant';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type SuccessTokenResponse = {
  status_message: string;
  success: boolean;
  status_code: number;
};

export type RequestTokenResponse = SuccessTokenResponse & {
  request_token: string;
};

export type AccessTokenResponse = SuccessTokenResponse & {
  access_token: string;
  account_id: string;
};

const baseUrl = [baseUrlApiV4, 'auth'].join('/');
const URL_REQUEST_TOKEN = [baseUrl, 'request_token'].join('/');
const URL_ACCESS_TOKEN = [baseUrl, 'access_token'].join('/');

@Injectable({ providedIn: 'root' })
export class Authv4Resource {
  private readonly http: HttpClient = inject(HttpClient);

  createRequestToken = (
    redirect_to: string,
  ): Observable<RequestTokenResponse> =>
    this.http.post<never>(URL_REQUEST_TOKEN, { redirect_to });

  createAccessToken = (requestToken: string): Observable<AccessTokenResponse> =>
    this.http.post<never>(URL_ACCESS_TOKEN, { request_token: requestToken });

  deleteAccessToken = (
    access_token: string,
  ): Observable<SuccessTokenResponse> =>
    this.http.delete<never>(URL_ACCESS_TOKEN, { body: { access_token } });
}
