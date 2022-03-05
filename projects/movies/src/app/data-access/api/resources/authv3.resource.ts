import { Observable } from 'rxjs';
import { baseUrlApiV3 } from './internal/base-urls.constant';
import { getHTTP } from '../../../shared/injector/get-http-client';
import { GuestSession } from '../model/guest-session.interface';
import { staticRequest } from '../staticRequest';

const baseUrl = [baseUrlApiV3, 'authentication'].join('/');
const URL_GUEST_SESSION = [baseUrl, 'guest_session', 'new'].join('/');

export const getGuestSession = (): Observable<GuestSession> => {
  return getHTTP().get<GuestSession>(URL_GUEST_SESSION);
};

export const getGuestSessionCached = staticRequest(getGuestSession);
