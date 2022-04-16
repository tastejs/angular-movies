import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class IconLoadStrategy {
  abstract load(url: string): Observable<string>;
}
