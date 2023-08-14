import { Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Observable, of } from 'rxjs';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  load(url: string): Observable<string> {
    return of(readFileSync(resolve(url), 'utf8'));
  }
}
