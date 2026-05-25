import { DOCUMENT } from '@angular/common';
import { afterNextRender, inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import {
  AccessTokenResponse,
  Authv4Resource,
  RequestTokenResponse,
} from '../data-access/api/resources/authv4.resource';
import { AccessTokenFacade } from './access-token-facade.service';
import { AccountState } from '../state/account.state';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  private readonly document = inject(DOCUMENT);
  private readonly authResource = inject(Authv4Resource);
  private readonly accessTokenFacade = inject(AccessTokenFacade);
  private readonly accountState = inject(AccountState);
  private readonly router = inject(Router);
  private finishingSignIn = false;
  private readonly redirectUrl = `${this.document.location.protocol}//${this.document.location.hostname}:${this.document.location.port}/list/category/popular`;

  constructor() {
    afterNextRender(() => this.tryFinishSignIn());

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.tryFinishSignIn());
  }

  signInStart = (): void => {
    this.authResource
      .createRequestToken(this.redirectUrl)
      .subscribe(({ request_token }: RequestTokenResponse) => {
        window.localStorage.setItem('requestToken', request_token);
        this.document.location.replace(
          `https://www.themoviedb.org/auth/access?request_token=${request_token}`,
        );
      });
  };

  signInFinish = (requestToken: string): void => {
    if (window.localStorage.getItem('requestToken') !== requestToken) {
      window.localStorage.setItem('requestToken', requestToken);
    }
    this.tryFinishSignIn();
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

  private tryFinishSignIn = (attempt = 0): void => {
    if (this.finishingSignIn) {
      return;
    }

    const requestToken = window.localStorage.getItem('requestToken');
    if (!requestToken || window.localStorage.getItem('accessToken')) {
      return;
    }

    this.finishingSignIn = true;

    this.authResource.createAccessToken(requestToken).subscribe({
      next: ({ access_token, account_id }: AccessTokenResponse) => {
        window.localStorage.removeItem('requestToken');
        window.localStorage.setItem('accountId', account_id);
        this.accountState.set({ accountId: account_id });
        window.localStorage.setItem('accessToken', access_token);
        this.accessTokenFacade.setUserAccessToken(access_token);
        this.finishingSignIn = false;
      },
      error: () => {
        this.finishingSignIn = false;
        if (attempt < 5 && window.localStorage.getItem('requestToken')) {
          setTimeout(
            () => this.tryFinishSignIn(attempt + 1),
            1000 * (attempt + 1),
          );
        }
      },
    });
  };
}
