import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { EdgeEnvToken } from '../../../../env.token';
import { HttpClient } from '@angular/common/http';

// @Injectable()
// export class IconLoadStrategySsr implements SvgLoadStrategy {
//   load(url: string): Observable<string> {
//     const iconPath = join(process.cwd(), 'dist', 'movies', 'browser', url);
//     const iconSVG = readFileSync(iconPath, 'utf8');
//     return of(iconSVG);
//   }
// }

@Injectable()
export class IconLoadStrategyWorker implements SvgLoadStrategy {
  edgeEnv = inject(EdgeEnvToken);
  http = inject(HttpClient);

  load(url: string): Observable<string> {
    const hostname = new URL(this.edgeEnv.request.url).hostname;
    const assetUrl = `http://${hostname}/${url}`;

    const init: RequestInit = {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    };

    return from(
      this.edgeEnv.env.ASSETS.fetch(new Request(assetUrl), init).then((res) =>
        !res.ok ? '' : res.text()
      )
    );
  }
}
