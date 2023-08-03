import { Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { readFileSync } from 'node:fs';
import { of } from 'rxjs';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  load(url: string) {
    return of(readFileSync(url, 'utf8'));
  }
}
