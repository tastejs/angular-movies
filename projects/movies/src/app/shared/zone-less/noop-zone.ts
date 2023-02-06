import { EventEmitter, NgZone } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

/**
 * Provides a noop like implementation of `NgZone` which does nothing and provides a way to customize behavior.
 * This zone requires explicit calls to framework to perform rendering.
 */
export class CustomNgZone {
  hasPendingMicrotasks = true;
  hasPendingMacrotasks = true;

  onUnstable = new EventEmitter();
  onMicrotaskEmpty = new EventEmitter();

  onStable = new BehaviorSubject(false);

  get isStable() {
    return this.onStable.getValue();
  }

  onError = new EventEmitter();

  constructor() {
    /**
     * Notice:
     * This is a hack to delay the emission of isStable for a micro task
     * This helps HttpTransferCache to get its values first from the cache
     */
    timer(3000).subscribe(() => {
      this.hasPendingMicrotasks = false;
      this.hasPendingMacrotasks = false;
      this.onStable.next(true);
    });
  }

  run(fn: () => any, applyThis: any, applyArgs: any) {
    return fn.apply(applyThis, applyArgs);
  }
  runGuarded(fn: () => any, applyThis: any, applyArgs: any) {
    return fn.apply(applyThis, applyArgs);
  }
  runOutsideAngular(fn: () => any) {
    return fn();
  }
  runTask(fn: () => any, applyThis: any, applyArgs: any, _: any) {
    return fn.apply(applyThis, applyArgs);
  }
}

export const CUSTOM_ZONE_PROVIDER = {
  provide: NgZone,
  /**
   * Normally `ɵNoopNgZone` is used here but we need to overwrite a bit of the logic to make TransferState work in a zone-less app
   * Provide hacks for Zone#isStable as it causes problems for HTTP cache to work
   */
  useClass: CustomNgZone,
};
