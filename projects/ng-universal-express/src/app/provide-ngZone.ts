import {
  EventEmitter,
  inject,
  Injectable,
  NgZone,
  ɵInitialRenderPendingTasks as InitialRenderPendingTasks
} from "@angular/core";
import {tap} from "rxjs";

// eslint
declare const ngDevMode: boolean;

export function provideNgZone() {
  return [{
    provide: NgZone,
    useClass: AppRenderedNgZone,
  }]
}

/**
 * Provides a noop like implementation of `NgZone` which does nothing and provides a way to customize behavior.
 * This zone implements the ApplicationRendered token and fires `onStable`
 */
@Injectable({
  providedIn: "root",
})
export class AppRenderedNgZone extends NgZone {
  private initialRenderPendingTasks = inject(InitialRenderPendingTasks)
  onStable = new EventEmitter();

  constructor() {
    super({});
    const timeToken = "onStableTrigger" + Math.random();

    if (ngDevMode)
      console.log(timeToken);
    console.time(timeToken);

    this.initialRenderPendingTasks.hasPendingTasks
      .pipe(
        tap(v => console.log('this.initialRenderPendingTasks', v))
      )
      .subscribe((isPending: boolean) => {
        if (!isPending) {
          if (ngDevMode)
            console.timeEnd(timeToken);

          this.onStable.emit();
        }
      });
  }

}
