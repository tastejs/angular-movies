import { RxState } from '@rx-angular/state';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs';
import { isAuthenticationInProgress } from './utils';
import { AuthStateModel } from './auth-state.model';

@Injectable({
  providedIn: 'root',
})
export class AuthState extends RxState<AuthStateModel> {
  private localStorage = this.document.defaultView?.localStorage ?? {
    getItem: () => null,
    removeItem: () => {},
    setItem: () => {},
  };

  readonly redirectUrl = `${this.document.location.protocol}//${this.document.location.hostname}:${this.document.location.port}/movies/popular`;
  readonly requestToken$ = this.select('requestToken');
  readonly accessToken$ = this.select('accessToken');
  readonly accountId$ = this.select('accountId');
  readonly isAuthenticationInProgress$ = this.select(
    map(isAuthenticationInProgress)
  );

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    super();
    if (isPlatformBrowser(platformId)) {
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
