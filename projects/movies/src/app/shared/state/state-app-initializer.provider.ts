import { APP_INITIALIZER } from '@angular/core';
import { StateService } from './state.service';

function initializeState(state: StateService) {
  return (): Promise<void> => {
    state.init();
    return Promise.resolve();
  };
}

// @TODO add perf tip here
export const stateAppInitializerProvider = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeState,
    deps: [StateService],
    multi: true
  }/**/
];
