import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { NavigationEnd, Router } from '@angular/router';
import { isNoopZone } from '../utils/is-noop-zone';
import { filter } from 'rxjs/operators';

/**
 * A small service encapsulating the hacks needed for routing in zone-less applications
 */
@Injectable({
  providedIn: 'root',
})
export class ZonelessRouting extends RxState<any> {
  constructor(
    private router: Router,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {
    super();
  }

  init() {
    // **🚀 Perf Tip:**
    // In zone-less applications we have to trigger CD on every `NavigationEnd` event that changes the view.
    if (isNoopZone(this.ngZone)) {
      this.hold(
        // Filter relevant navigation events for change detection
        this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
        // In a service we have to use `ApplicationRef#tick` to trigger change detection.
        // In a component we use `ChangeDetectorRef#detectChanges()` as it is less work compared to `ApplicationRef#tick` as it's less work.
        () => this.appRef.tick()
      );
    }
  }
}
