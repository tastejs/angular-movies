import { inject, Injectable, REQUEST } from '@angular/core';
import { SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class IconLoadStrategySsr implements SvgLoadStrategy {
  private readonly request = inject(REQUEST, { optional: true });

  config(url: string): Observable<string> {
    return of(url);
  }

  load(url$: Observable<string>): Observable<string> {
    return url$.pipe(
      switchMap((url) => {
        const origin = this.request ? new URL(this.request.url).origin : '';
        const assetUrl = `${origin}/${url}`;

        return from(fetch(assetUrl).then((r) => r.text()));
      }),
    );
  }
}
