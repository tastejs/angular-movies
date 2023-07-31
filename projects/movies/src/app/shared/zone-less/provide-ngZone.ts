import {
  EventEmitter,
  inject,
  Injectable,
  NgZone,
  ɵInitialRenderPendingTasks as InitialRenderPendingTasks,
} from "@angular/core";
import {BehaviorSubject, skip, startWith, tap} from "rxjs";

declare const ngDevMode: boolean;

export function provideNgZoneZoneless() {
  return {
    provide: NgZone,
    useClass: AppRenderedNgZoneZoneless,
  }
}

/**
 * Provides a noop like implementation of `NgZone` which does nothing and provides a way to customize behavior.
 * This zone requires explicit calls to framework to perform rendering.
 */
@Injectable({
  providedIn: "root",
})
export class AppRenderedNgZoneZoneless {
  private initialRenderPendingTasks = inject(InitialRenderPendingTasks)
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
    const timeToken = "onStableTrigger" + Math.random();
    if (ngDevMode)
      console.time(timeToken);

    /**
     * Notice:
     * This is a hack to delay the emission of isStable for a micro task
     * This helps HttpTransferCache to get its values first from the cache
     */

    this.initialRenderPendingTasks.hasPendingTasks
      .pipe(
        skip(1),
        startWith(true),
        tap(console.log)
      )
      .subscribe((isPending: boolean) => {
        if (!isPending) {

          if (ngDevMode)
            console.timeEnd(timeToken);

          this.hasPendingMicrotasks = false;
          this.hasPendingMacrotasks = false;
          this.onStable.next(true);
        }
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
