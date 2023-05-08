import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AccessTokenFacade {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly accessTokenSubject = new BehaviorSubject<string>(
    environment.tmdbApiReadAccessKey
  );

  get accessToken(): string {
    return this.accessTokenSubject.getValue();
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // set accessToken if found in localStorage
      const accessToken = window.localStorage.getItem('accessToken');
      accessToken && this.setUserAccessToken(accessToken);
    }
  }

  setUserAccessToken(accessToken: string) {
    this.accessTokenSubject.next(accessToken);
  }

  resetToReadAccessToken(): void {
    this.accessTokenSubject.next(environment.tmdbApiReadAccessKey);
  }
}
