import { inject, InjectFlags, InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';

declare const ngDevMode: boolean;

export function describeRxState<STATE extends Record<string, unknown>>(
  initialState?: Partial<STATE>
) {
  const token = new InjectionToken<RxState<STATE>>('RxState');

  return {
    provide() {
      return [
        RxState,
        {
          provide: token,
          useFactory() {
            const store = inject(RxState);
            store.set(initialState || {});
            return store;
          },
        },
      ];
    },
    inject() {
      const state = inject(token, InjectFlags.Self | InjectFlags.Optional);

      if (ngDevMode && state == null) {
        throw new Error(`Oups! It seems that you forgot to provide the state.
Try adding "provideXXX()" to your declarable's providers.`);
      }

      return state as RxState<STATE>;
    },
  };
}
