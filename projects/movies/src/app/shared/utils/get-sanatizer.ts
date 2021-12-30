import { getInjector } from './injector.instance';
import { DomSanitizer } from '@angular/platform-browser';

let _sanatizer: DomSanitizer;

export function getSanatizer(): DomSanitizer {
  return _sanatizer || (_sanatizer = getInjector().get(DomSanitizer));
}
