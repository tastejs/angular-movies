import { expect, type Page } from '@playwright/test';
import {
  profileMenu,
  profileMenuLoginItem,
  profileMenuSignoutItem,
} from 'test-selectors';
import { logMenuDebug, logMenuDebugError } from './menu-debug';
import { ProfileMenuPage } from '../pages/profile-menu.page';
import { tmdbAuthStepTimeout } from './tmdb';
import { ROUTES } from './test-data';

/** Poll localStorage until OAuth token exchange completes. */
export async function waitForSessionReady(
  page: Page,
  timeout = tmdbAuthStepTimeout,
): Promise<void> {
  await logMenuDebug(page, 'waitForSessionReady:start');

  await page.waitForFunction(
    () =>
      !!window.localStorage.getItem('accessToken') &&
      !!window.localStorage.getItem('accountId'),
    { timeout },
  );

  await logMenuDebug(page, 'waitForSessionReady:done');
}

/** Poll until hover reveals the logged-in account menu (not transient guest UI). */
export async function waitForLoggedInProfileMenu(
  page: Page,
  timeout = tmdbAuthStepTimeout,
): Promise<void> {
  await waitForSessionReady(page, timeout);
  await logMenuDebug(page, 'waitForLoggedInProfileMenu:start');

  const profileMenuPage = new ProfileMenuPage(page);
  let attempt = 0;

  await expect(async () => {
    attempt += 1;
    await logMenuDebug(page, 'waitForLoggedInProfileMenu:poll', { attempt });

    try {
      await profileMenuPage.hoverOpen();
      await expect(page.locator(profileMenuSignoutItem)).toBeVisible();
      await expect(page.locator(profileMenuLoginItem)).toHaveCount(0);
      await logMenuDebug(page, 'waitForLoggedInProfileMenu:poll-success', {
        attempt,
      });
    } catch (error) {
      logMenuDebugError(`waitForLoggedInProfileMenu:poll-${attempt}`, error);
      throw error;
    }
  }).toPass({ timeout });

  await logMenuDebug(page, 'waitForLoggedInProfileMenu:done');
}

/** After TMDB redirects back, wait until the logged-in profile menu is ready. */
export async function waitForAuthReturnToApp(
  page: Page,
  timeout = tmdbAuthStepTimeout,
): Promise<void> {
  await logMenuDebug(page, 'waitForAuthReturnToApp:start');

  await page.waitForURL(`**${ROUTES.popular}`, {
    timeout,
    waitUntil: 'commit',
  });
  await logMenuDebug(page, 'waitForAuthReturnToApp:url-ready');

  await waitForSessionReady(page, timeout);
  await page
    .locator(profileMenu)
    .waitFor({ state: 'visible', timeout: 30_000 });
  await logMenuDebug(page, 'waitForAuthReturnToApp:profile-button-visible');

  await waitForLoggedInProfileMenu(page, timeout);
  await logMenuDebug(page, 'waitForAuthReturnToApp:done');
}
