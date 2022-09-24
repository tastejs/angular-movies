import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZonelessRouting } from '../shared/zone-less/zone-less-routing.service';

@Component({
  selector: 'app-root',
  template: `
    <app-shell *rxLet="[]">
      <router-outlet></router-outlet>
    </app-shell>
  `,
  /**
   * **🚀 Perf Tip for TBT:**
   *
   * Use ChangeDetectionStrategy.OnPush in all components to reduce change detection & template re-evaluation
   */
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  /**
   *  **🚀 Perf Tip:**
   *
   *  In zone-less applications we have to handle routing manually.
   *  This is a necessity to make it work zone-less but does not make the app faster.

     import { ZonelessRouting } from './shared/zone-agnostic/zone-less-routing.service';

     constructor(private zonelessRouting: ZonelessRouting) {
       this.zonelessRouting.init();
     }
   *
   */
  constructor(private zonelessRouting: ZonelessRouting) {
    this.zonelessRouting.init();
  }
}
