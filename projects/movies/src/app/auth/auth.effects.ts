import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { exhaustMap, filter, map, Observable, switchMap, take } from 'rxjs';
import { Authv4Resource, Token, } from '../data-access/api/resources/authv4.resource';
import { lazyInject } from '../shared/lazy-inject';

const LazyAuthState = () => import('../state/auth.state').then(x => x.AuthState);

@Injectable({ providedIn: 'root' })
export class AuthEffects {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authState$ = lazyInject(LazyAuthState);
  private readonly authResource = inject(Authv4Resource);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.authState$.pipe(take(1)).subscribe((authState) => {
        authState.isAuthenticationInProgress$.pipe(
          filter((inProgress) => !inProgress),
          take(1),
          switchMap(() => this.createAccessToken$())
        ).subscribe((accessTokenResult) => {
          // delete in local storage
          window.localStorage.removeItem('requestToken');
          // store in local storage for the next page load
          window.localStorage.setItem('accessToken', accessTokenResult.accessToken);
          window.localStorage.setItem('accountId', accessTokenResult.accountId);
          authState.set({ ...authState.get(), ...accessTokenResult });
        });
      });
    }
  }

  createAccessToken$ = (): Observable<{
    accessToken: string;
    accountId: string;
  }> => {
    return this.authState$.pipe(
      switchMap((authState) => {
        return authState.requestToken$.pipe(
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
      })
    )
  };

  approveRequestToken = (): void => {
    this.authState$.pipe(
      switchMap((authState) =>
        this.authResource.createRequestToken(authState.redirectUrl)
      ),
      take(1)
    ).subscribe((res: Token) => {
      // store in local storage for the next page load
      window.localStorage.setItem('requestToken', res.request_token);
      this.document.location.replace(
        `https://www.themoviedb.org/auth/access?request_token=${ res.request_token }`
      );
    });
  };

  signOut = () => {
    this.authState$.pipe(take(1)).subscribe((authState) => {
      const accessToken = authState.get('accessToken');
      // store in local storage for the next page load
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('accountId');
      window.localStorage.removeItem('requestToken');
      authState.set({ accessToken: undefined, accountId: undefined, requestToken: undefined });
      if (accessToken) this.authResource.deleteAccessToken(accessToken).subscribe();
    });
  };
}
