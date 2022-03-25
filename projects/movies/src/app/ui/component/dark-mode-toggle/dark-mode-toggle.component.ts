import { DOCUMENT } from '@angular/common';
import { RxState } from '@rx-angular/state';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'ui-dark-mode-toggle',
  template: `
    <div class="dark-mode-toggle">
      <button type="button" class="light" (click)="setChecked(true)">☀</button>

      <span class="toggle">
        <input
          *rxLet="isLightTheme$; let checked; strategy: 'immediate'"
          class="toggle-track"
          type="checkbox"
          id="dark-mode"
          [checked]="checked"
          (change)="setChecked(!checked)"
        />
        <label style="color: transparent" for="dark-mode">
          Toggle Switch
        </label>
      </span>

      <button type="button" class="dark" (click)="setChecked(false)">☾</button>
    </div>
  `,
  styleUrls: ['dark-mode-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DarkModeToggleComponent extends RxState<{
  isLightTheme: boolean;
}> {
  isLightTheme$ = this.select('isLightTheme');

  constructor(@Inject(DOCUMENT) private document: Document) {
    super();
    this.set({ isLightTheme: true });
    this.hold(this.isLightTheme$, this.toggleTheme);
  }

  toggleTheme = (isLightTheme: boolean): void => {
    if (isLightTheme) {
      this.document.body.classList.remove('dark');
      this.document.body.classList.add('light');
    } else {
      this.document.body.classList.add('dark');
      this.document.body.classList.remove('light');
    }
  };

  setChecked(isLightTheme: boolean): void {
    this.set({ isLightTheme });
  }
}
