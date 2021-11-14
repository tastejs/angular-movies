import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZonelessRouting } from './shared/zone-agnostic/zone-less-routing.service';

@Component({
  selector: 'app-root',
  template: `
    <app-shell>
      <router-outlet></router-outlet>
    </app-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private zonelessRouting: ZonelessRouting) {
    /**
     *  **🚀 Perf Tip:**
     *
     *  In zone-less applications we have to handle routing manually.
     *  This is a necessity to make it work zone-less but does not make the app faster.
     */
    this.zonelessRouting.init();
  }
}
