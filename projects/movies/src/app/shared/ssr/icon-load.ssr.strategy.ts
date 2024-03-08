import { Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { cwd } from 'node:process';
import { Observable } from 'rxjs';
import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

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

      const icon = readFileSync(resolve(fullIconPath), 'utf-8');
      observer.next(icon);
    });
  }
}
