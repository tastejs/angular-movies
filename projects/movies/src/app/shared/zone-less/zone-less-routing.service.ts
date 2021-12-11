import { ApplicationRef, Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { NavigationEnd, Router } from '@angular/router';
import { isZonePresent } from './is-zone-present';

/**
 * A small service encapsulating the hacks needed for routing (and bootstrapping) in zone-less applications
 */
@Injectable({
  providedIn: 'root'
})
export class ZonelessRouting extends RxState<any> {
  constructor(private router: Router, private appRef: ApplicationRef) {
    super();
  }

  init() {
    /**
     * **🚀 Perf Tip:**
     *
     * In zone-less applications we have to trigger CD on every `NavigationEnd` event that changes the view.
     * This is a necessity to make it work zone-less, but does not make the app faster.
     */
    if (!isZonePresent()) {
      this.hold(
        // Filter relevant navigation events for change detection
        this.router.events,
        // In a service we have to use `ApplicationRef#tick` to trigger change detection.
        // In a component we use `ChangeDetectorRef#detectChanges()` as it is less work compared to `ApplicationRef#tick` as it's less work.
        (e) => {
          if (e instanceof NavigationEnd) {
            this.appRef.tick();
          }
        }
      );
    }
  }
}
