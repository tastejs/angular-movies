import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component, effect,
  inject, signal,
  ViewEncapsulation
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-dark-mode-toggle',
  template: `
    <div class="dark-mode-toggle">
      <button
        aria-label="Enable dark mode"
        type="button"
        class="light"
        (click)="isLightTheme.set(true)"
      >
        ☀
      </button>

      <span class="toggle">
        <input
          class="toggle-track"
          type="checkbox"
          id="dark-mode"
          [checked]="!isLightTheme()"
          (change)="isLightTheme.set(!isLightTheme())"
        />
        <label style="color: transparent" for="dark-mode">
          Toggle Switch
        </label>
      </span>

      <button
        aria-label="Disable dark mode"
        type="button"
        class="dark"
        (click)="isLightTheme.set(false)"
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

  private readonly document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      this.toggleTheme(this.isLightTheme());
    });
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
}
