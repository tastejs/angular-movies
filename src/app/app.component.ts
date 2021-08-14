import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZonelessRouting } from './shared/zone-agnostic/zone-less-routing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private zonelessRouting: ZonelessRouting) {
    // **🚀 Perf Tip:**
    // In zone-less applications we have to handle routing manually.
    this.zonelessRouting.init();
  }
}
