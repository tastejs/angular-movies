import { Directive, ElementRef } from '@angular/core';
import { supportsImageLoading } from '../../shared/utils/supports-image-loading';

declare const ngDevMode: boolean;

/**
 * **🚀 Perf Tip:**
 * To get out the best performance use the native HTML attribute. This avoids bootstrap and template evaluation time.
 */
@Directive({
  /* eslint-disable-next-line @angular-eslint/directive-selector */
  selector: 'img'
})
export class LazyImgDirective {
  constructor({ nativeElement }: ElementRef) {

    if (supportsImageLoading) {
      /**
       * **🚀 Perf Tip:**
       * Apply the loading attribute and set it to lazy for all images in the application.
       * Notice for images in the LCP it would be a bit counter productive as the loading happens with a lower priority if loading is set to lazy.
       */
      nativeElement.setAttribute('loading', 'lazy');
    }
    /**
     * **🚀 Perf Tip:**
     * if you guard a code block with `ngDevMode` the Angular compiler will remove it in a production build
     */
    else if (ngDevMode) {
      console.warn('The Browser does not support the loading attribute on images. Consider using IntersectionObserver (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)');
    }
  }
}
