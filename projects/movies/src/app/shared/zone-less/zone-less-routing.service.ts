import { afterNextRender, inject, Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isZonePresent } from './is-zone-present';
import { rxEffects } from '@rx-angular/state/effects';

/**
 * A small service encapsulating the hacks needed for routing (and bootstrapping) in zone-less applications
 */
@Injectable({
  providedIn: 'root',
})
export class ZonelessRouting {
  private readonly effects = rxEffects();
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  init() {
    /**
     * **🚀 Perf Tip:**
     *
     * In zone-less applications we have to trigger CD on every `NavigationEnd` event that changes the view.
     * This is a necessity to make it work zone-less, but does not make the app faster.
     */
    if (!isZonePresent()) {
      afterNextRender(() => {
        this.effects.register(
          // Filter relevant navigation events for change detection
          this.router.events,
          // In a service we have to use `ApplicationRef#tick` to trigger change detection.
          // In a component we use `ChangeDetectorRef#detectChanges()` as it is less work compared to `ApplicationRef#tick` as it's less work.
          (e) => {
            if (e instanceof NavigationEnd) {
              // Inside appRef [NgZone.onMicrotaskEmpty is used to call appRef.tick()](https://github.com/angular/angular/blob/2fc5b70fcedb8ac35b825b245c0ae394dc125244/packages/core/src/application_ref.ts#L769)
              // As the router events are not tracked in a zone-less environment we programmatically schedule onMicrotaskEmpty here to trigger CD after routing occurred
              this.ngZone.onMicrotaskEmpty.next(true);
            }
          }
        );
      });
    }
  }
}
