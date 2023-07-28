import {waitForElementTiming} from "../cdk/element-timing/wait-for-element-timing";
import {EventEmitter, inject, Injectable, NgZone} from "@angular/core";
import {ApplicationRendered} from "../cdk/application-rendered/applicationRenderdToken";
import {BehaviorSubject} from "rxjs";

declare const ngDevMode: boolean;

export function provideNgZoneZoneless() {
  return [{
    provide: ApplicationRendered,
    useFactory: () => () => waitForElementTiming(['header-main', 'tile-img'])
  },
    {
      provide: NgZone,
      useClass: AppRenderedNgZoneZoneless,
    }]
}

/**
 * Provides a noop like implementation of `NgZone` which does nothing and provides a way to customize behavior.
 * This zone requires explicit calls to framework to perform rendering.
 */
@Injectable({
  providedIn: "root",
})
export class AppRenderedNgZoneZoneless {
  applicationRenderDone = inject(ApplicationRendered);
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
    if (ngDevMode)
      console.time("onStableTrigger");

    /**
     * Notice:
     * This is a hack to delay the emission of isStable for a micro task
     * This helps HttpTransferCache to get its values first from the cache
     */
    this.applicationRenderDone()
      .then(() => {
        if (ngDevMode)
          console.timeEnd('onStableTrigger');

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
