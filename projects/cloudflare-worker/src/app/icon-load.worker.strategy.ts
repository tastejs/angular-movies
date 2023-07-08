import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {SvgLoadStrategy} from '@push-based/ngx-fast-svg';
import {finalize, from, Observable} from 'rxjs';
import {createBackgroundMacroTask} from '../../../angular-common/fetch';
import {EdgeEnvToken} from '../../../../env.token';

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
