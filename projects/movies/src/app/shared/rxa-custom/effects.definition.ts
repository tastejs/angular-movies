import { inject, InjectFlags, InjectionToken } from '@angular/core';
import { RxEffects } from '@rx-angular/state/effects';

declare const ngDevMode: boolean;

export function describeRxEffects() {
  const token = new InjectionToken<RxEffects>('RxEffects');

  return {
    provide() {
      return [
        RxEffects,
        {
          provide: token,
          useClass: RxEffects,
        },
      ];
    },
    inject() {
      const ef = inject(token, InjectFlags.Self | InjectFlags.Optional);

      if (ngDevMode && ef == null) {
        throw new Error(`Oups! It seems that you forgot to add provides for the effects service.
Try adding "provideXXX()" to your declarable's providers.`);
      }

      return ef as RxEffects;
    },
  };
}
