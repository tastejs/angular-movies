import { Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { readFile } from 'node:fs';
import { join, resolve } from 'node:path';
import { Observable } from 'rxjs';
import { cwd } from 'node:process';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  load(url: string): Observable<string> {
    return new Observable<string>((observer) => {
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

      // log all current folder content
      console.log('cwd', cwd());

      readFile(resolve(fullIconPath), { encoding: 'utf8' }, (error, data) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(data);
        }
      });
    });
  }
}
