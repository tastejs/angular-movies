import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Configuration } from './configuration.interface';

@Injectable({
  providedIn: 'root'
})
export class Tmdb2Service {
  constructor(private http: HttpClient) {
  }

  private readonly apiVersion = environment.tmdbApiVersion;
  private readonly baseUrl = [environment.tmdbBaseUrl, this.apiVersion].join('/');

  private readonly URL_CONFIGURATION = [this.baseUrl, 'configuration'].join('/');

  getConfig = (): Observable<Configuration> =>
    this.http.get<Configuration>(this.URL_CONFIGURATION);

}
