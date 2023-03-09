import { CommonModule, DOCUMENT } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
  signal,
  effect,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
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
          class="toggle-track"
          type="checkbox"
          id="dark-mode"
          [checked]="isLightTheme()"
          (change)="setChecked(!isLightTheme())"
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
  isLightTheme = signal(true);

  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => this.toggleTheme(this.isLightTheme()));
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
    this.isLightTheme.set(isLightTheme);
  }
}
