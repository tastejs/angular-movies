import { Observable } from 'rxjs';
import { IconProviderToken } from '../../../shared/fast-icon/token/icon-provider.token';
import { IconProvider } from '../../../shared/fast-icon/token/icon-provider.model';
import { HttpClient } from '@angular/common/http';

export const FAST_ICON_PROVIDERS = [
  {
    provide: IconProviderToken,
    useFactory: (http: HttpClient): IconProvider => ({
      id: 'tmdb',
      defaultSize: 24,
      url: (name: string): string => {
        return `assets/svg-icons/${name}.svg`;
      },
      load: (url: string): Observable<string> =>
        http.get(url, { responseType: 'text' }),
    }),
    deps: [HttpClient],
  },
];
