import { LoadIconFunctionSsrToken } from '../../../shared/fast-icon/token/load-icon-funtion.ssr.token';
import { LoadIconFunctionSsr } from '../../../shared/fast-icon/load-svg.ssr.model';
import { IconProviderToken } from '../../../shared/fast-icon/token/icon-provider.token';
import { IconProvider } from '../../../shared/fast-icon/token/icon-provider.model';
import { HttpClient } from '@angular/common/http';

const f =
  (http: HttpClient): LoadIconFunctionSsr =>
  (provider, name) =>
    http.get(provider.url(name), { responseType: 'text' });

const _t = (http: HttpClient): IconProvider => ({
  id: '3',
  defaultSize: 24,
  url: (name: string): string => {
    return `../../../../assets/svg-icons/${name}.svg`;
  },
  load: (provider, name) =>
    http.get(provider.url(name), { responseType: 'text' }),
});
_t;

const t = (http: HttpClient): IconProvider => ({
  id: '3',
  defaultSize: 24,
  url: (name: string): string => {
    return `assets/svg-icons/${name}.svg`;
  },
  load: (provider, name) =>
    http.get(provider.url(name), { responseType: 'text' }),
});

export const FAST_ICON_PROVIDERS = [
  {
    provide: LoadIconFunctionSsrToken,
    useFactory: f,
    deps: [HttpClient],
  },
  {
    provide: IconProviderToken,
    useFactory: t,
    deps: [HttpClient],
  },
];
