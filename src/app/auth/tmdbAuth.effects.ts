import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { Tmdb2Service } from '../shared/service/tmdb/tmdb2.service';
import { AuthStateService, isAuthenticationInProgress } from './auth.state';

@Injectable({
  providedIn: 'root',
})
export class TmdbAuthEffects {
  constructor(private authState: AuthStateService, private tmdb: Tmdb2Service) {
    this.restoreLogin();
  }

  restoreLogin(): void {
    if (isAuthenticationInProgress(this.authState.state.getValue())) {
      this.createAccessToken$().subscribe((accessTokenResult) => {
        // delete in local storage
        window.localStorage.removeItem('requestToken');
        // store in local storage for the next page load
        window.localStorage.setItem(
          'accessToken',
          accessTokenResult.accessToken
        );
        window.localStorage.setItem('accountId', accessTokenResult.accountId);
        this.authState.state.next({
          ...this.authState.state.getValue(),
          ...accessTokenResult,
        });
      });
    }
  }

  createAccessToken$(): Observable<{ accessToken: string; accountId: string }> {
    console.log('createAccessToken$', this.authState.state.getValue());
    return this.authState.requestToken$.pipe(
      take(1),
      exhaustMap((requestToken) => this.tmdb.createAccessToken(requestToken)),
      map(({ access_token, account_id }) => ({
        accessToken: access_token,
        accountId: account_id,
      }))
    );
  }

  approveRequestToken(): void {
    console.log('approveRequestToken', this.authState.redirectUrl);
    this.tmdb
      .createRequestToken(this.authState.redirectUrl)
      .subscribe((res) => {
        console.log('res', res);
        // store in local storage for the next page load
        window.localStorage.setItem('requestToken', res.request_token);
        window.location.replace(
          `https://www.themoviedb.org/auth/access?request_token=${res.request_token}`
        );
      });
  }

  signOut() {
    const accessToken = this.authState.state.getValue().accessToken;

    // store in local storage for the next page load
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('accountId');
    window.localStorage.removeItem('requestToken');
    this.authState.state.next({
      accessToken: undefined,
      accountId: undefined,
      requestToken: undefined,
    });
    if (accessToken) {
      this.tmdb.deleteAccessToken(accessToken).subscribe();
    }
  }
}
