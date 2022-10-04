import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  OnDestroy,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { RxActionFactory } from '../../rxa-custom/actions';
import { observeElementVisibility } from './observe-element-visibility';
import { takeUntil } from 'rxjs';

type Actions = { visible: boolean; onDestroy: void };

@Directive({
  standalone: true,
  selector: '[elementVisibility]',
})
export class ElementVisibilityDirective implements OnDestroy {
  signals = this.actionsF.create();

  @Output()
  elementVisibility = this.signals.visible$;

  constructor(
    private actionsF: RxActionFactory<Actions>,
    elRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      observeElementVisibility(elRef.nativeElement)
        .pipe(takeUntil(this.signals.onDestroy$))
        .subscribe(this.signals.visible);
    }
  }

  ngOnDestroy(): void {
    this.signals.onDestroy();
  }
}
