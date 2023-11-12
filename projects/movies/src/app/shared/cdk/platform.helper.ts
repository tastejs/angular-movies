import {inject, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

let platformId: {} | null = null;
export function onBrowser(cb: () => void): void {
  if(!platformId) {
    platformId = inject(PLATFORM_ID);
  }
  isPlatformBrowser(platformId) && cb();
}
