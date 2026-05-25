import { test as setup } from '@playwright/test';
import { AUTH_STORAGE_PATH } from '../fixtures/auth.fixture';

setup('authenticate', async () => {
  setup.skip(
    true,
    'Login flows are disabled — restore setup in playwright.config.ts to re-enable',
  );
});

export { AUTH_STORAGE_PATH };
