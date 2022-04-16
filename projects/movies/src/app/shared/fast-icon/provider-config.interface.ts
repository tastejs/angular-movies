import { IconOptions } from './token/icon-options.model';
import {
  Type
} from '@angular/core';
import { IconLoadStrategy } from './token/icon-load.strategy.model';

export interface FastSvgProviderOptions {
  url: IconOptions['url'],
  defaultSize?: IconOptions['defaultSize'],
  suspenseIconString?: IconOptions['suspenseIconString'],
  iconLoadStrategy?: Type<IconLoadStrategy>,
}
