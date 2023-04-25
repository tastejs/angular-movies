import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'iframe[bypassSrc]',
})
export class BypassSrcDirective {
  @Input()
  set bypassSrc(src: any) {
    if (typeof src === 'string') {
      this.element.nativeElement.src = src;
    }
  }

  constructor(private element: ElementRef) {}
}
