import { Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { readFile } from 'node:fs';
import { resolve } from 'node:path';
import { Observable } from 'rxjs';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  load(url: string): Observable<string> {
    // eslint-disable-next-line unicorn/prefer-module
    console.log('~~ IconLoadStrategySsr', __dirname, url);
    return new Observable<string>((observer) => {
      readFile(resolve(url), { encoding: 'utf8' }, (error, data) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(data);
        }
      });
    });
  }
}
