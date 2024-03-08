import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ZonelessRouting } from './shared/zone-less/zone-less-routing.service';
import { AppShellComponent } from './app-shell/app-shell.component';
import { RouterOutlet } from '@angular/router';
import { RxLet } from '@rx-angular/template/let';

@Component({
  selector: 'app-root',
  template: `
    <app-shell *rxLet="[]">
      <router-outlet />
    </app-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AppShellComponent, RouterOutlet, RxLet],
})
export class AppComponent {
  /**
   *  **🚀 Perf Tip:**
   *
   *  In zone-less applications we have to handle routing manually.
   *  This is a necessity to make it work zone-less but does not make the app faster.

   import { ZonelessRouting } from './shared/zone-agnostic/zone-less-routing.service';

   constructor() {
    inject(ZonelessRouting).init();
  }
   *
   */
  constructor() {
    inject(ZonelessRouting).init();
  }
}
