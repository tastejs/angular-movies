import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import { observeElementVisibility } from './observe-element-visibility';
import { takeUntil } from 'rxjs';

type Actions = { visible: boolean; onDestroy: void };

@Directive({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[elementVisibility]',
})
export class ElementVisibilityDirective implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  signals = this.actionsF.create();

  @Output()
  elementVisibility = this.signals.visible$;

  constructor(private actionsF: RxActionFactory<Actions>, elRef: ElementRef) {
    if (isPlatformBrowser(this.platformId)) {
      observeElementVisibility(elRef.nativeElement)
        .pipe(takeUntil(this.signals.onDestroy$))
        .subscribe(this.signals.visible);
    }
  }

  ngOnDestroy(): void {
    this.signals.onDestroy();
  }
}
