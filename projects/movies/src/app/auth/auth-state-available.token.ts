import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const AUTH_STATE_LOADED = new InjectionToken<
  BehaviorSubject<boolean>
>('Is AuthState service already injected', {
  providedIn: 'root',
  factory: () => new BehaviorSubject(false),
});
