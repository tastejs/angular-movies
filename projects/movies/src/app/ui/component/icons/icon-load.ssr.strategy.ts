import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IconLoadStrategy } from '../../../shared/fast-icon/token/icon-load.strategy.model';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class IconLoadStrategySsr implements IconLoadStrategy {
  constructor() {}

  load(url: string): Observable<string> {
    const iconPath = join(process.cwd(), 'dist', 'movies', 'browser', url);
    const iconSVG = readFileSync(iconPath, 'utf8');
    return of(iconSVG);
  }
}
