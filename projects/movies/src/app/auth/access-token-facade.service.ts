import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AccessTokenFacade {
  private readonly platformId = inject(PLATFORM_ID);

  private _accessToken = environment.tmdbApiReadAccessKey;

  get accessToken(): string {
    return this._accessToken;
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // set accessToken if found in localStorage
      const accessToken = window.localStorage.getItem('accessToken');
      accessToken && this.setUserAccessToken(accessToken);
    }
  }

  setUserAccessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  resetToReadAccessToken(): void {
    this._accessToken = environment.tmdbApiReadAccessKey;
  }
}
