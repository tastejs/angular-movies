import { Observable } from 'rxjs';
import { baseUrlApiV4 } from './internal/base-urls.constant';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Token = {
  request_token: string;
  access_token: string;
  account_id: string;
};

const baseUrl = [baseUrlApiV4, 'auth'].join('/');
const URL_REQUEST_TOKEN = [baseUrl, 'request_token'].join('/');
const URL_ACCESS_TOKEN = [baseUrl, 'access_token'].join('/');

@Injectable({
  providedIn: 'root',
})
export class Authv4Resource {
  constructor(private http: HttpClient) {}

  createRequestToken = (redirectTo: string): Observable<Token> =>
    this.http.post<any>(URL_REQUEST_TOKEN, {
      redirect_to: redirectTo,
    });

  createAccessToken = (requestToken: string): Observable<Token> =>
    this.http.post<any>(URL_ACCESS_TOKEN, { request_token: requestToken });

  deleteAccessToken = (accessToken: string): Observable<Token> =>
    this.http.delete<any>(URL_ACCESS_TOKEN, {
      body: { access_token: accessToken },
    });
}
