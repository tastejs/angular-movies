import { RxState } from '@rx-angular/state';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import { map } from 'rxjs';

export interface AuthStateModel {
  requestToken: string | null;
  accessToken: string | null;
  accountId: string | null;
}


@Injectable({ providedIn: 'root' })
export class AuthState extends RxState<AuthStateModel> {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private localStorage = this.document.defaultView?.localStorage ?? {
    getItem: () => null,
    removeItem: () => {},
    setItem: () => {},
  };

  readonly redirectUrl = `${this.document.location.protocol}//${this.document.location.hostname}:${this.document.location.port}/list/category/popular`;
  readonly requestToken$ = this.select('requestToken');
  readonly accessToken$ = this.select('accessToken');
  readonly accountId$ = this.select('accountId');
  readonly isAuthenticationInProgress$ = this.select(
    map(isAuthenticationInProgress)
  );

  constructor() {
    super();
    if (isPlatformBrowser(this.platformId)) {
      this.rebootStore();
    }
    this.set({
      requestToken: this.localStorage.getItem('requestToken'),
      accessToken: this.localStorage.getItem('accessToken'),
      accountId: this.localStorage.getItem('accountId'),
    });
  }

  private rebootStore() {
    const requestToken = this.localStorage.getItem('requestToken') || undefined;
    if (requestToken !== undefined) {
      this.localStorage.removeItem('accessToken');
      this.localStorage.removeItem('accountId');
    }
    const accessToken = this.localStorage.getItem('accessToken') || undefined;
    if (accessToken !== undefined) {
      this.localStorage.removeItem('requestToken');
    } else {
      this.localStorage.removeItem('accountId');
    }
  }
}

export function isAuthenticationInProgress(state: Partial<AuthStateModel>): boolean {
  const { requestToken, accessToken, accountId } = state;

  if (
    isLoggedIn(requestToken, accessToken, accountId) ||
    isGuest(requestToken)
  ) {
    return false;
  }

  // Authentication process in progress
  return true;
}

export function isGuest(requestToken?: string | null): boolean {
  // Guest user:
  // Authentication process not in progress
  // No request requestToken and user
  return !requestToken;
}

export function isLoggedIn(
  requestToken?: string | null,
  accessToken?: string | null,
  accountId?: string | null
): boolean {
  const userPresent = !!accessToken && !!accountId;
  // Already logged in:
  // No requestToken given and user data are present user is authed
  return !requestToken && userPresent;
}
