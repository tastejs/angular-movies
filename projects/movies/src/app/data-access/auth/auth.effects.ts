import { Injectable } from '@angular/core';
import { exhaustMap, filter, map, Observable, take, tap } from 'rxjs';
import { AuthState } from './auth.state';
import { isAuthenticationInProgress } from './utils';
import {
  createAccessToken,
  createRequestToken,
  deleteAccessToken,
} from '../api/resources/auth.resource';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  constructor(private authState: AuthState) {
    this.restoreLogin();
  }

  restoreLogin(): void {
    console.log('restoreLogin');
    if (isAuthenticationInProgress(this.authState.get())) {
      console.log('isAuthenticationInProgress', false);
      this.createAccessToken$().subscribe((accessTokenResult) => {
        console.log('accessTokenResult', accessTokenResult);
        // delete in local storage
        window.localStorage.removeItem('requestToken');
        // store in local storage for the next page load
        window.localStorage.setItem(
          'accessToken',
          accessTokenResult.accessToken
        );
        window.localStorage.setItem('accountId', accessTokenResult.accountId);
        this.authState.set({
          ...this.authState.get(),
          ...accessTokenResult,
        });
      });
    }
  }

  createAccessToken$(): Observable<{ accessToken: string; accountId: string }> {
    return this.authState.requestToken$.pipe(
      tap((v) => console.log('requestToken$', v)),
      take(1),
      filter(<T>(v: T | null): v is T => v != null),
      exhaustMap((requestToken) => createAccessToken(requestToken)),
      map(({ access_token, account_id }) => ({
        accessToken: access_token,
        accountId: account_id,
      }))
    );
  }

  approveRequestToken(): void {
    createRequestToken(this.authState.redirectUrl).subscribe((res) => {
      // store in local storage for the next page load
      window.localStorage.setItem('requestToken', res.request_token);
      window.location.replace(
        `https://www.themoviedb.org/auth/access?request_token=${res.request_token}`
      );
    });
  }

  signOut() {
    const accessToken = this.authState.get().accessToken;
    console.log('accessToken', this.authState.get());
    // store in local storage for the next page load
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('accountId');
    window.localStorage.removeItem('requestToken');
    this.authState.set({
      accessToken: undefined,
      accountId: undefined,
      requestToken: undefined,
    });
    console.log('accessToken', accessToken);
    if (accessToken) {
      deleteAccessToken(accessToken).subscribe();
    }
  }
}
