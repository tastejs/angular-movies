import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

interface AuthState {
  requestToken: string;
  accessToken: string;
  accountId: string;
}

export function isAuthenticationInProgress({
  requestToken,
  accessToken,
  accountId,
}: Partial<AuthState>): boolean {
  const userPresent = accessToken && accountId;

  // Already logged in:
  // No requestToken given and user data are present user is authed
  if (!requestToken && userPresent) {
    return false;
  }

  // Guest user:
  // Authentication process not in progress
  // No request requestToken and user
  if (!requestToken) {
    return false;
  }

  // Authentication process in progress
  return true;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  redirectUrl = 'http://localhost:4200/movies/now-playing';
  private localStorage = window.localStorage;
  state = new BehaviorSubject<Partial<AuthState>>({
    requestToken: this.localStorage.getItem('requestToken') || null,
    accessToken: this.localStorage.getItem('accessToken') || null,
    accountId: this.localStorage.getItem('accountId') || null,
  });

  requestToken$ = this.state.pipe(
    map((s) => s.requestToken),
    distinctUntilChanged(),
    filter((v) => v !== undefined)
  );
  accessToken$ = this.state.pipe(
    map((s) => s.accessToken),
    distinctUntilChanged(),
    filter((v) => v !== undefined)
  );
  accountId$ = this.state.pipe(
    map((s) => s.accountId),
    distinctUntilChanged(),
    filter((v) => v !== undefined)
  );
  isAuthenticationInProgress$ = this.state.pipe(
    map(isAuthenticationInProgress)
  );
}
