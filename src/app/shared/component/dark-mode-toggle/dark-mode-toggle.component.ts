import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'app-dark-mode-toggle',
  template: `
    <div class="dark-mode-toggle">
      <button type="button" class="light" (click)="setChecked(true)">☀</button>

      <span class="toggle">
        <input
          *rxLet="checked$; let checked"
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent extends RxState<{ checked: boolean }> {
  checked$ = this.select('checked');

  constructor() {
    super();
    this.set({ checked: false });
    this.hold(this.checked$, this.toggleTheme);
  }

  toggleTheme = (): void => {
    window.document.body.classList.toggle('dark');
    window.document.body.classList.toggle('light');
  }

  setChecked(checked: boolean): void {
    this.set({ checked });
  }
}
