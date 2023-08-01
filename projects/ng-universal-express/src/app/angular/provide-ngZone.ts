import {
  EventEmitter,
  inject,
  Injectable,
  NgZone,
  ɵInitialRenderPendingTasks as InitialRenderPendingTasks
} from "@angular/core";

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
      console.time(timeToken);

    this.initialRenderPendingTasks.hasPendingTasks
      .subscribe((isPending: boolean) => {
        if (ngDevMode)
          console.log('initialRenderPendingTasks', isPending);
        if (!isPending) {
          if (ngDevMode)
            console.timeEnd(timeToken);

          this.onStable.emit();
        }
      });
  }

}
