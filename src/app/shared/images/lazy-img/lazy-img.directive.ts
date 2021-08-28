import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'img',
})
export class LazyImgDirective {
  constructor(private elem: ElementRef) {
    this.elem.nativeElement.setAttribute('loading', 'lazy');
  }
}
