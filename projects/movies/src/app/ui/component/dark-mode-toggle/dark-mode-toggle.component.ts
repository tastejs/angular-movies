import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'app-dark-mode-toggle',
  template: `
    <div class="dark-mode-toggle">
      <button type="button" class="light" (click)="setChecked(true)">☀</button>

      <span class="toggle">
        <input
          *rxLet="isLightTheme$; let checked; strategy:'immediate'"
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
})
export class DarkModeToggleComponent extends RxState<{
  isLightTheme: boolean;
}> {
  isLightTheme$ = this.select('isLightTheme');

  constructor() {
    super();
    this.set({ isLightTheme: true });
    this.hold(this.isLightTheme$, this.toggleTheme);
  }

  toggleTheme = (isLightTheme: boolean): void => {
    if (isLightTheme) {
      window.document.body.classList.remove('dark');
      window.document.body.classList.add('light');
    } else {
      window.document.body.classList.add('dark');
      window.document.body.classList.remove('light');
    }
  }

  setChecked(isLightTheme: boolean): void {
    this.set({ isLightTheme });
  }
}
