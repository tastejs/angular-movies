import { Observable } from 'rxjs';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { GuestSession } from '../model/guest-session.interface';
import { staticRequest } from '../staticRequest';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = [baseUrlApiV3, 'authentication'].join('/');
const URL_GUEST_SESSION = [baseUrl, 'guest_session', 'new'].join('/');

@Injectable({
  providedIn: 'root',
})
export class GuestSessionResource {
  private readonly http: HttpClient = inject(HttpClient);
  getGuestSession = (): Observable<GuestSession> => {
    return this.http.get<GuestSession>(URL_GUEST_SESSION);
  };
  getGuestSessionCached = staticRequest(this.getGuestSession);
}
