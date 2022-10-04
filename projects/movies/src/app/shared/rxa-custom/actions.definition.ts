import { inject, InjectFlags, InjectionToken } from '@angular/core';
import { ActionTransforms, RxActionFactory } from '@rx-angular/state/actions';

declare const ngDevMode: boolean;

export function describeRxActions<TRIGGER extends Record<string, unknown>>(
  transforms?: ActionTransforms<TRIGGER>
) {
  const token = new InjectionToken<RxActionFactory<TRIGGER>>('RxActionFactory');

  return {
    provide() {
      return [
        RxActionFactory,
        {
          provide: token,
          useFactory() {
            const fac = inject(RxActionFactory);
            return fac;
          },
        },
      ];
    },
    inject() {
      const fac = inject(token, InjectFlags.Self | InjectFlags.Optional);

      if (ngDevMode && fac == null) {
        throw new Error(`Oups! It seems that you forgot to provide the state.
Try adding "provideXXX()" to your declarable's providers.`);
      }

      return (fac as RxActionFactory<TRIGGER>).create(transforms);
    },
  };
}
