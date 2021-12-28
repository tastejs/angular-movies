import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthResource {
  constructor(private http: HttpClient) {
  }

  private readonly apiNewVersion = environment.tmdbApiNewVersion;
  private readonly baseUrl = [environment.tmdbBaseUrl, this.apiNewVersion].join('/');

  private readonly URL_REQUEST_TOKEN = [
    this.baseUrl,
    'auth',
    'request_token'
  ].join('/');

  private readonly URL_ACCESS_TOKEN = [
    this.baseUrl,
    'auth',
    'access_token'
  ].join('/');

  createRequestToken(redirectTo: string): Observable<any> {
    return this.http.post<any>(this.URL_REQUEST_TOKEN, {
      redirect_to: redirectTo
    });
  }

  createAccessToken = (requestToken: string): Observable<any> =>
    this.http.post<any>(this.URL_ACCESS_TOKEN, { request_token: requestToken });

  deleteAccessToken = (accessToken: string): Observable<any> =>
    this.http.delete<any>(this.URL_ACCESS_TOKEN, {
      body: { access_token: accessToken }
    });

}
