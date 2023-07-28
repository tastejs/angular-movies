import {InjectionToken} from '@angular/core';

export const ApplicationRendered = new InjectionToken<() => Promise<void>>('');
