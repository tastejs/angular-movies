import { APP_INITIALIZER } from '@angular/core';
import { StateService } from './state.service';

function initializeState(state: StateService) {
  return (): Promise<void> => {
    return state.init();
  };
}

// @TODO add perf tip here
export const StateAppInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: initializeState,
  deps: [StateService],
  multi: true,
};
