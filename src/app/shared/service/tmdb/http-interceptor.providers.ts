import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReadAccessInterceptor } from './read-access.intercepter';
import { ContentTypeJsonInterceptor } from './content-type-json.intercepter';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ReadAccessInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ContentTypeJsonInterceptor,
    multi: true,
  },
];
