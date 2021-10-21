import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, map } from 'rxjs';

interface AuthState {
  requestToken: string | null;
  accessToken: string | null;
  accountId: string | null;
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
  redirectUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/movies/popular`;
  private localStorage = window.localStorage;
  state = new BehaviorSubject<Partial<AuthState>>({
    requestToken: this.localStorage.getItem('requestToken') || undefined,
    accessToken: this.localStorage.getItem('accessToken') || undefined,
    accountId: this.localStorage.getItem('accountId') || undefined,
  });

  requestToken$ = this.state.pipe(
    map((s) => s.requestToken),
    distinctUntilChanged(),
    filter(<T>(v: T): v is Exclude<T, null | undefined> => v !== undefined)
  );
  accessToken$ = this.state.pipe(
    map((s) => s.accessToken),
    distinctUntilChanged(),
    filter(<T>(v: T): v is Exclude<T, null | undefined> => v !== undefined)
  );
  accountId$ = this.state.pipe(
    map((s) => s.accountId),
    distinctUntilChanged(),
    filter(<T>(v: T): v is Exclude<T, null | undefined> => v !== undefined)
  );
  isAuthenticationInProgress$ = this.state.pipe(
    map(isAuthenticationInProgress)
  );
}
