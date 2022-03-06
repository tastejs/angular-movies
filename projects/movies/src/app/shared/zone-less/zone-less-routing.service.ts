import { ApplicationRef, ErrorHandler, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isZonePresent } from './is-zone-present';
import { RxEffects } from '@rx-angular/state/effects';

/**
 * A small service encapsulating the hacks needed for routing (and bootstrapping) in zone-less applications
 */
@Injectable({
  providedIn: 'root',
  deps: [RxEffects],
})
export class ZonelessRouting extends RxEffects {
  constructor(
    private router: Router,
    private appRef: ApplicationRef,
    errorHandler: ErrorHandler
  ) {
    super(errorHandler);
  }

  init() {
    /**
     * **🚀 Perf Tip:**
     *
     * In zone-less applications we have to trigger CD on every `NavigationEnd` event that changes the view.
     * This is a necessity to make it work zone-less, but does not make the app faster.
     */
    if (!isZonePresent()) {
      this.register(
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
