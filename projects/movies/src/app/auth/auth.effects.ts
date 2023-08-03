import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AccessTokenResponse, Authv4Resource, RequestTokenResponse,} from '../data-access/api/resources/authv4.resource';
import {AccessTokenFacade} from './access-token-facade.service';
import {AccountState} from '../state/account.state';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authResource = inject(Authv4Resource);
  private readonly accessTokenFacade = inject(AccessTokenFacade);
  private readonly accountState = inject(AccountState);
  private readonly redirectUrl = `${this.document.location.protocol}//${this.document.location.hostname}:${this.document.location.port}/list/category/popular`;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // should we finish the signIn ?
      const requestToken = window.localStorage.getItem('requestToken');
      requestToken && this.signInFinish(requestToken);
    }
  }

  signInStart = (): void => {
    this.authResource
      .createRequestToken(this.redirectUrl)
      .subscribe(({ request_token }: RequestTokenResponse) => {
        if (isPlatformBrowser(this.platformId)) {
          // after redirecting to the redirectUrl, the requestToken in localStorage will indicate that an accessToken should be requested
          window.localStorage.setItem('requestToken', request_token);
        }
        this.document.location.replace(
          `https://www.themoviedb.org/auth/access?request_token=${request_token}`
        );
      });
  };

  signInFinish = (requestToken: string): void => {
    this.authResource
      .createAccessToken(requestToken)
      .subscribe(({ access_token, account_id }: AccessTokenResponse) => {
        if (isPlatformBrowser(this.platformId)) {
          window.localStorage.removeItem('requestToken');

          window.localStorage.setItem('accountId', account_id);
          this.accountState.set({ accountId: account_id });

          window.localStorage.setItem('accessToken', access_token);
          this.accessTokenFacade.setUserAccessToken(access_token);
        }
      });
  };

  signOut = (): void => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) {
      this.authResource.deleteAccessToken(accessToken).subscribe();
    }
    window.localStorage.clear();
    this.accountState.set({ accountId: null });
    this.accessTokenFacade.resetToReadAccessToken();
  };
}
