import {DOCUMENT} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation,} from '@angular/core';
import {RxLet} from '@rx-angular/template/let';
import {rxState} from '@rx-angular/state';
import {rxEffects} from "@rx-angular/state/effects";

@Component({
  standalone: true,
  imports: [RxLet],
  selector: 'ui-dark-mode-toggle',
  template: `
    <div class="dark-mode-toggle">
      <button
        aria-label="Enable dark mode"
        type="button"
        class="light"
        (click)="setChecked(true)"
      >
        ☀
      </button>

      <span class="toggle">
        <input
          *rxLet="isLightTheme$; let isLightTheme"
          class="toggle-track"
          type="checkbox"
          id="dark-mode"
          [checked]="!isLightTheme"
          (change)="setChecked(!isLightTheme)"
        />
        <label style="color: transparent" for="dark-mode">
          Toggle Switch
        </label>
      </span>

      <button
        aria-label="Disable dark mode"
        type="button"
        class="dark"
        (click)="setChecked(false)"
      >
        ☾
      </button>
    </div>
  `,
  styleUrls: ['dark-mode-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DarkModeToggleComponent {
  state = rxState<{ isLightTheme: boolean }>(({set}) => {
    set({ isLightTheme: true });
  });
  isLightTheme$ = this.state.select('isLightTheme');
  effects = rxEffects(e => e.
  register(this.isLightTheme$, this.toggleTheme));
  private readonly document = inject(DOCUMENT);

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
    this.state.set({ isLightTheme });
  }
}
