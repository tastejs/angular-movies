import { RXA_PROVIDER_SSR } from '../shared/rxa-custom/rxa.provider.ssr';
import { APP_PROVIDERS } from '../app.provider';

export const APP_SERVER_PROVIDERS = [APP_PROVIDERS, RXA_PROVIDER_SSR];
