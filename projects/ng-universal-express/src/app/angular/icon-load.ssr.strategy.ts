import {readFileSync} from 'node:fs';
import {of} from "rxjs";
import {Injectable} from '@angular/core';
import {SvgLoadStrategy} from '@push-based/ngx-fast-svg';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  load(url: string) {
    const iconSVG = readFileSync(url, 'utf8');
    return of(iconSVG);
  }
}
