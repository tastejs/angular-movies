import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Provides a noop like implementation of `NgZone` which does nothing and provides a way to customize behavior.
 * This zone requires explicit calls to framework to perform rendering.
 */
export class CustomNgZone {
  hasPendingMicrotasks = false;
  hasPendingMacrotasks = false;

  onUnstable = new EventEmitter();
  onMicrotaskEmpty = new EventEmitter();

  onStable = new BehaviorSubject(false);

  get isStable() {
    return this.onStable.getValue();
  }

  onError = new EventEmitter();
  constructor() {}
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
