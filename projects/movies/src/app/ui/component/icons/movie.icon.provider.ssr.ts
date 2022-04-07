import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { IconProviderToken } from '../../../shared/fast-icon/token/icon-provider.token';
import { IconProvider } from '../../../shared/fast-icon/token/icon-provider.model';

export const FAST_ICON_PROVIDERS_SSR = [
  {
    provide: IconProviderToken,
    useFactory: (): IconProvider => ({
      id: 'tmdb',
      defaultSize: 24,
      url: (name: string): string => {
        return `assets/svg-icons/${name}.svg`;
      },
      load: (url: string): Observable<string> => {
        const iconPath = join(process.cwd(), 'dist', 'movies', 'browser', url);
        const iconSVG = readFileSync(iconPath, 'utf8');
        console.log('--- icon:', { url, iconPath, iconSVG });
        return of(iconSVG);
      },
    }),
  },
];
