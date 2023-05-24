import { Injectable, inject } from '@angular/core';
import { Observable, finalize, from } from 'rxjs';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { EdgeEnvToken } from '../../../../env.token';
import { HttpClient } from '@angular/common/http';
import { createBackgroundMacroTask } from '../../../angular-common/fetch';

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
    const assetUrl = `https://${hostname}/${url}`;

    const macroTaskCanceller = createBackgroundMacroTask();

    return from(
      this.edgeEnv.env.ASSETS.fetch(new Request(assetUrl)).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.text();
      })
    ).pipe(finalize(() => macroTaskCanceller()));
  }
}
