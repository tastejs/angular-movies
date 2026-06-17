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
        // Icons are emitted as static assets under `assets/svg-icons/`.
        // Fetching the bare `${origin}/${url}` (e.g. `/popular.svg`) would miss
        // the asset, fall through to the Angular `**` route, redirect to
        // `/page-not-found` and trigger a recursive SSR render per icon.
        const assetUrl = `${origin}/assets/svg-icons/${url}`;

        return from(fetch(assetUrl).then((r) => r.text()));
      }),
    );
  }
}
