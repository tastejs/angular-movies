import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { exhaustMap, filter, map, Observable, take } from 'rxjs';
import { AuthState } from '../state/auth.state';
import { isAuthenticationInProgress } from '../auth/utils';
import {
  Authv4Resource,
  Token,
} from '../data-access/api/resources/authv4.resource';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authState = inject(AuthState);
  private readonly authResource = inject(Authv4Resource);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      if (isAuthenticationInProgress(this.authState.get())) {
        this.createAccessToken$().subscribe((accessTokenResult) => {
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
  }

  createAccessToken$ = (): Observable<{
    accessToken: string;
    accountId: string;
  }> => {
    return this.authState.requestToken$.pipe(
      take(1),
      filter(<T>(v: T | null): v is T => v != null),
      exhaustMap((requestToken) =>
        this.authResource.createAccessToken(requestToken)
      ),
      map(({ access_token, account_id }: Token) => ({
        accessToken: access_token,
        accountId: account_id,
      }))
    );
  };

  approveRequestToken = (): void => {
    this.authResource
      .createRequestToken(this.authState.redirectUrl)
      .subscribe((res: Token) => {
        // store in local storage for the next page load
        window.localStorage.setItem('requestToken', res.request_token);
        this.document.location.replace(
          `https://www.themoviedb.org/auth/access?request_token=${res.request_token}`
        );
      });
  };

  signOut = () => {
    const accessToken = this.authState.get()?.accessToken;
    // store in local storage for the next page load
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('accountId');
    window.localStorage.removeItem('requestToken');
    this.authState.set({
      accessToken: undefined,
      accountId: undefined,
      requestToken: undefined,
    });
    if (accessToken) {
      this.authResource.deleteAccessToken(accessToken).subscribe();
    }
  };
}
