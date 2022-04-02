import { InjectionToken } from '@angular/core';
import { LoadIconFunctionSsr } from '../load-svg.ssr.model';

export const LoadIconFunctionSsrToken = new InjectionToken<LoadIconFunctionSsr>(
  'LoadIconFunctionSsr'
);
