import { InjectionToken } from '@angular/core';
import { IconProvider } from './icon-provider.model';

export const IconProviderToken = new InjectionToken<IconProvider>(
  'IconProvider'
);
