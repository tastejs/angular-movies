import {EventEmitter} from '@angular/core';
import {BehaviorSubject, timer} from 'rxjs';

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
    timer(2000).subscribe(() => {
      this.hasPendingMicrotasks = false;
      this.hasPendingMacrotasks = false;
      this.onStable.next(true);
    });
  }

  run(fn: () => unknown, applyThis: unknown, applyArgs: []) {
    return fn.apply(applyThis, applyArgs);
  }

  runGuarded(fn: () => unknown, applyThis: unknown, applyArgs: []) {
    return fn.apply(applyThis, applyArgs);
  }

  runOutsideAngular(fn: () => unknown) {
    return fn();
  }

  runTask(fn: () => unknown, applyThis: unknown, applyArgs: []) {
    return fn.apply(applyThis, applyArgs);
  }
}
