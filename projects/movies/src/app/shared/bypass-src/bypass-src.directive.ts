import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: "iframe[bypassSrc]",
})
export class BypassSrcDirective {

  @Input()
  set bypassSrc(src: any) {
    if(typeof src === 'string') {
      this.element.nativeElement.src = src;
    }
  }

  constructor(private element: ElementRef) {
  }

}
