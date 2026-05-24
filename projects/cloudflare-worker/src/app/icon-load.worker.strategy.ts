import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { from, Observable, of, switchMap } from 'rxjs';
import { EdgeEnvironmentToken } from './environment.token';

@Injectable()
export class IconLoadStrategyWorker implements SvgLoadStrategy {
  edgeEnv = inject(EdgeEnvironmentToken);
  http = inject(HttpClient);

  config(url: string): Observable<string> {
    return of(url);
  }

  load(url$: Observable<string>): Observable<string> {
    return url$.pipe(
      switchMap((url) => {
        const hostname = new URL(this.edgeEnv.request.url).hostname;
        const assetUrl = `https://${hostname}/${url}`;

        return from(
          this.edgeEnv.env.ASSETS.fetch(new Request(assetUrl)).then(
            (response) => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.text();
            }
          )
        );
      })
    );
  }
}
