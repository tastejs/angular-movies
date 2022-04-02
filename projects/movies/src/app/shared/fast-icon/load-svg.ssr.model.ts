import { Observable } from 'rxjs';
import { IconProvider } from './token/icon-provider.model';

export type LoadIconFunctionSsr = (
  provider: IconProvider,
  name: string
) => Observable<string>;
