import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RxState } from '@rx-angular/state';

@Component({
  selector: 'app-dark-mode-toggle',
  template: `
    <div class="dark-mode-toggle">
      <button type="button" class="light" (click)="checked.next(true)">
        ☀
      </button>

      <span class="toggle">
        <input
          *rxLet="checked; let c"
          class="toggle-track"
          type="checkbox"
          id="dark-mode"
          [checked]="c"
          (change)="checked.next(!c)"
        />
        <label style="color: transparent" for="dark-mode">
          Toggle Switch
        </label>
      </span>

      <button type="button" class="dark" (click)="checked.next(false)">
        ☾
      </button>
    </div>
  `,
  styleUrls: ['dark-mode-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent extends RxState<any> {
  checked = new BehaviorSubject(false);

  constructor() {
    super();
    this.hold(this.checked, () => {
      window.document.body.classList.toggle('dark');
      window.document.body.classList.toggle('light');
    });
  }
}
