import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RxState } from '@rx-angular/state';

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
export class AuthStateService extends RxState<AuthState>{
  redirectUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/movies/popular`;
  private localStorage = window.localStorage;

  requestToken$ = this.select('requestToken');
  accessToken$ = this.select('accessToken');
  accountId$ = this.select('accountId');
  isAuthenticationInProgress$ = this.select(
    map(isAuthenticationInProgress)
  );

  constructor() {
    super();
    this.set({
      requestToken: this.localStorage.getItem('requestToken') || undefined,
      accessToken: this.localStorage.getItem('accessToken') || undefined,
      accountId: this.localStorage.getItem('accountId') || undefined,
    });
  }
}
