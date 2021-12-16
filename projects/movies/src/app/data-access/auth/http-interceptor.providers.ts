import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReadAccessInterceptor } from './read-access.interceptor';
import { ContentTypeJsonInterceptor } from './content-type-json.interceptor';

export const HTTP_INTERCEPTORS_PROVIDER = [
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
