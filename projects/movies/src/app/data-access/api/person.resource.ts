import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MoviePersonModel } from '../model/movie-person.model';
import { baseUrlApiV3 } from './utils';

@Injectable({
  providedIn: 'root'
})
export class PersonResource {
  constructor(private http: HttpClient) {
  }

  private readonly baseUrl = baseUrlApiV3;

  private readonly URL_PERSON = (id: string) => `${[this.baseUrl, 'person', id].join('/')}?append_to_response=videos`;

  getPerson = (id: string): Observable<MoviePersonModel> => this.http.get<MoviePersonModel>(this.URL_PERSON(id), { params: {} });

}
