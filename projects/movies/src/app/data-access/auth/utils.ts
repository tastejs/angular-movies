import { AuthState } from './auth-state.interface';

export function isAuthenticationInProgress({
                                             requestToken,
                                             accessToken,
                                             accountId
                                           }: Partial<AuthState>): boolean {
  const userPresent = accessToken && accountId;

  // Already logged in:
  // No requestToken given and user data are present user is authed
  if (!requestToken && userPresent) {
    return false;
  }

  // Guest user:
  // Authentication process not in progress
  // No request requestToken and user
  if (!requestToken) {
    return false;
  }

  // Authentication process in progress
  return true;
}
