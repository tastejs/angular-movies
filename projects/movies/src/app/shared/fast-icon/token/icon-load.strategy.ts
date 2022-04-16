import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class IconLoadStrategyImpl {

  constructor(private http: HttpClient) {
  }

  load(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}

