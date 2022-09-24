import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZonelessRouting } from './shared/zone-less/zone-less-routing.service';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { AppShellComponent } from './app-shell/app-shell.component';

@Component({
  standalone: true,
  imports: [RouterModule, AppShellComponent, LetModule],
  selector: 'app-root',
  template: `
    <app-shell *rxLet="[]">
      <router-outlet></router-outlet>
    </app-shell>
  `,
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
