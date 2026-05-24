import { Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { cwd } from 'node:process';
import { map, Observable, of } from 'rxjs';
import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  config(url: string): Observable<string> {
    return of(url);
  }

  load(url$: Observable<string>): Observable<string> {
    return url$.pipe(
      map((url) => {
        const fullIconPath = join(
          cwd(),
          'dist',
          'projects',
          'movies',
          'browser',
          'assets',
          'svg-icons',
          `${url}`
        );

        return readFileSync(resolve(fullIconPath), 'utf-8');
      })
    );
  }
}
