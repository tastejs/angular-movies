import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { isAuthenticationInProgress } from './utils';
import { AuthStateModel } from './auth-state.model';

@Injectable({
  providedIn: 'root',
})
export class AuthState extends RxState<AuthStateModel> {
  private localStorage = window.localStorage;
  readonly redirectUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/movies/popular`;

  readonly requestToken$ = this.select('requestToken');
  readonly accessToken$ = this.select('accessToken');
  readonly accountId$ = this.select('accountId');
  readonly isAuthenticationInProgress$ = this.select(
    map(isAuthenticationInProgress)
  );

  constructor() {
    super();
    this.set({
      requestToken: this.localStorage.getItem('requestToken'),
      accessToken: this.localStorage.getItem('accessToken'),
      accountId: this.localStorage.getItem('accountId'),
    });
  }
}
