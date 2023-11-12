import {afterNextRender, DestroyRef, Directive, ElementRef, inject, Output} from '@angular/core';
import {rxActions} from '@rx-angular/state/actions';
import {observeElementVisibility} from './observe-element-visibility';

type Actions = { visible: boolean; onDestroy: void };

@Directive({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[elementVisibility]',
})
export class ElementVisibilityDirective {
  private readonly destroyRef = inject(DestroyRef);

  events = rxActions<Actions>();

  @Output()
  elementVisibility = this.events.visible$;

  constructor(elRef: ElementRef) {
    afterNextRender(() => {
      const sub = observeElementVisibility(elRef.nativeElement)
        .subscribe(this.events.visible);
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    })
  }
}
