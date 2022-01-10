import { AuthStateModel } from './auth-state.model';

export function isAuthenticationInProgress({
  requestToken,
  accessToken,
  accountId,
}: Partial<AuthStateModel>): boolean {
  if (
    isLoggedIn(requestToken, accessToken, accountId) ||
    isGuest(requestToken)
  ) {
    return false;
  }

  // Authentication process in progress
  return true;
}

export function isGuest(requestToken?: string | null): boolean {
  // Guest user:
  // Authentication process not in progress
  // No request requestToken and user
  return !requestToken;
}

export function isLoggedIn(
  requestToken?: string | null,
  accessToken?: string | null,
  accountId?: string | null
): boolean {
  const userPresent = !!accessToken && !!accountId;
  // Already logged in:
  // No requestToken given and user data are present user is authed
  return !requestToken && userPresent;
}
