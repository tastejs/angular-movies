import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccessTokenFacade {
  private readonly accessTokenSubject = new BehaviorSubject<string>(
    environment.tmdbApiReadAccessKey
  );
  accessToken$ = this.accessTokenSubject.pipe(distinctUntilChanged());

  get accessToken(): string {
    return this.accessTokenSubject.getValue();
  }

  updateAccessToken(accessToken: string) {
    this.accessTokenSubject.next(accessToken);
  }

  resetAccessToken(): void {
    this.accessTokenSubject.next(environment.tmdbApiReadAccessKey);
  }
}
