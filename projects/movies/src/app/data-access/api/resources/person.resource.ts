import { Observable } from 'rxjs';
import { TMDBPersonModel } from '../model/person.model';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { TMDBAppendOptions } from './model/append-options';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type PersonResponse = TMDBPersonModel;

const URL_PERSON = (id: string) => `${[baseUrlApiV3, 'person', id].join('/')}`;

@Injectable({
  providedIn: 'root',
})
export class PersonResource {
  private readonly http: HttpClient = inject(HttpClient);

  getPerson = (
    id: string,
    params: TMDBAppendOptions = { append_to_response: 'videos' }
  ): Observable<PersonResponse> => {
    return this.http.get<PersonResponse>(URL_PERSON(id), { params });
  };
}
