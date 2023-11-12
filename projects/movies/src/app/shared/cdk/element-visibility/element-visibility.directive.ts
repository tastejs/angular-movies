import {isPlatformBrowser} from '@angular/common';
import {DestroyRef, Directive, ElementRef, inject, Output, PLATFORM_ID} from '@angular/core';
import {rxActions} from '@rx-angular/state/actions';
import {observeElementVisibility} from './observe-element-visibility';

type Actions = { visible: boolean; onDestroy: void };

@Directive({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[elementVisibility]',
})
export class ElementVisibilityDirective {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  events = rxActions<Actions>();

  @Output()
  elementVisibility = this.events.visible$;

  constructor(elRef: ElementRef) {
    if (isPlatformBrowser(this.platformId)) {
      const sub = observeElementVisibility(elRef.nativeElement)
        .subscribe(this.events.visible);
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }
}
