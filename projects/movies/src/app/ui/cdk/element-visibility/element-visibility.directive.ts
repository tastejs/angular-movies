import { Directive, ElementRef, OnDestroy, Output } from '@angular/core';
import { getActions } from '../../../shared/rxa-custom/actions';
import { observeElementVisibility } from './observe-element-visibility';
import { takeUntil } from 'rxjs';

@Directive({
  selector: '[elementVisibility]',
})
export class ElementVisibilityDirective implements OnDestroy {
  signals = getActions<{ visible: boolean; onDestroy: void }>();

  @Output()
  elementVisibility = this.signals.visible$;

  constructor(elRef: ElementRef) {
    observeElementVisibility(elRef.nativeElement)
      .pipe(takeUntil(this.signals.onDestroy$))
      .subscribe(this.signals.visible);
  }

  ngOnDestroy(): void {
    this.signals.onDestroy();
  }
}
