import { Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { readFileSync } from 'node:fs';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  load(url: string) {
    return [readFileSync(url, 'utf8')] as any; // could be of(val). but arrays are observable like, and we have just one static value (saves bytes)
  }
}
