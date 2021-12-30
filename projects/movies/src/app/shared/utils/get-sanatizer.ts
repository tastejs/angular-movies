import { getInjector } from './injector.instance';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

let _sanatizer: DomSanitizer;

export function getSanatizer(): DomSanitizer {
  return _sanatizer || (_sanatizer = getInjector().get(DomSanitizer));
}

export function bypassResourceUrl(value: string): SafeResourceUrl {
  return getSanatizer().bypassSecurityTrustResourceUrl(value + '');
}
