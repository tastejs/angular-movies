import { CUSTOM_ZONE_PROVIDER } from './shared/zone-less/noop-zone';

/**
 * These providers are only present in Browser (Client) version of the app.
 * Not provided to Server-side rendered app.
 */
export const APP_BROWSER_PROVIDER = [CUSTOM_ZONE_PROVIDER];
