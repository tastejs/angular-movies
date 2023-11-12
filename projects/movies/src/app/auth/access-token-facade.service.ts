import { afterNextRender, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccessTokenFacade {
  private _accessToken = environment.tmdbApiReadAccessKey;

  get accessToken(): string {
    return this._accessToken;
  }

  constructor() {
    afterNextRender(() => {
      // set accessToken if found in localStorage
      const accessToken = window.localStorage.getItem('accessToken');
      accessToken && this.setUserAccessToken(accessToken);
    });
  }

  setUserAccessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  resetToReadAccessToken(): void {
    this._accessToken = environment.tmdbApiReadAccessKey;
  }
}
