import { HttpClient } from '@angular/common/http';
import { IconProviderToken } from '../../../shared/fast-icon/token/icon-provider.token';
import { IconProvider } from '../../../shared/fast-icon/token/icon-provider.model';

export const FAST_ICON_PROVIDERS_SSR = [
  {
    provide: IconProviderToken,
    useFactory: (http: HttpClient): IconProvider => ({
      id: 'tmdb',
      defaultSize: 24,
      url: (name: string): string => {
        return `http://localhost:4200/assets/svg-icons/${name}.svg`;
      },
      load: (url: string) => {
        return http.get(url, { responseType: 'text' });
      },
    }),
    deps: [HttpClient],
  },
];
