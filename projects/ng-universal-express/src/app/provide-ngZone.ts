import {EventEmitter, inject, Injectable, NgZone} from "@angular/core";
import {ApplicationRendered} from "../../../movies/src/app/shared/cdk/application-rendered/application-renderd-token";

declare const ngDevelopmentMode: boolean;

export function provideNgZone() {
  return [{
    provide: ApplicationRendered,
    useFactory: () => () => Promise.resolve()
  },
    {
      provide: NgZone,
      useClass: AppRenderedNgZone,
    }]
}

/**
 * Provides a noop like implementation of `NgZone` which does nothing and provides a way to customize behavior.
 * This zone requires explicit calls to framework to perform rendering.
 */
@Injectable({
  providedIn: "root",
})
export class AppRenderedNgZone extends NgZone {
  applicationRenderDone = inject(ApplicationRendered);
  // eslint-disable-next-line unicorn/prefer-event-target
  onStable = new EventEmitter();

  constructor() {
    super({});

    this.applicationRenderDone()
      .then(() => {
        if (ngDevelopmentMode)
          console.timeEnd('onStableTrigger');
      })
  }

}
