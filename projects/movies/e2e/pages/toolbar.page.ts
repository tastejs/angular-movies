import { expect, type Page } from '@playwright/test';
import { profileMenuLoginItem, profileMenuSignoutItem } from 'test-selectors';
import { waitForAuthReturnToApp } from '../fixtures/auth-helpers';
import { logMenuDebug, logMenuDebugError } from '../fixtures/menu-debug';
import { tmdbAuthStepTimeout, tmdbAuthUrlPart } from '../fixtures/tmdb';
import { ProfileMenuPage } from './profile-menu.page';

export class ToolbarPage {
  private readonly profileMenu: ProfileMenuPage;

  constructor(private readonly page: Page) {
    this.profileMenu = new ProfileMenuPage(page);
  }

  async openProfileMenu(): Promise<void> {
    await this.profileMenu.open();
  }

  async goToTmdbLogin(): Promise<void> {
    await logMenuDebug(this.page, 'toolbar.goToTmdbLogin:start');
    await this.profileMenu.openWithItem(profileMenuLoginItem);

    const loginClick = this.page.locator(profileMenuLoginItem).click();

    const requestTokenResponse = this.page
      .waitForResponse(
        (r) =>
          r.url().includes('/4/auth/request_token') &&
          r.request().method() === 'POST',
        { timeout: tmdbAuthStepTimeout },
      )
      .catch(() => null);

    const tmdbNavigation = this.page.waitForURL(
      (url) => url.href.includes(tmdbAuthUrlPart),
      { timeout: tmdbAuthStepTimeout, waitUntil: 'commit' },
    );

    await loginClick;
    const tokenResponse = await requestTokenResponse;

    if (tokenResponse && !tokenResponse.ok()) {
      const body = await tokenResponse.text().catch(() => '');
      throw new Error(
        `TMDB request_token failed (${tokenResponse.status()}): ${body}`,
      );
    }

    await tmdbNavigation;
    await logMenuDebug(this.page, 'toolbar.goToTmdbLogin:done');
  }

  async expectLoggedIn(): Promise<void> {
    await logMenuDebug(this.page, 'toolbar.expectLoggedIn:start');

    try {
      await waitForAuthReturnToApp(this.page);
      await logMenuDebug(this.page, 'toolbar.expectLoggedIn:after-auth-return');

      await this.profileMenu.openWithItem(profileMenuSignoutItem);
      await expect(this.page.locator(profileMenuSignoutItem)).toBeVisible();

      await logMenuDebug(this.page, 'toolbar.expectLoggedIn:done');
    } catch (error) {
      await logMenuDebug(this.page, 'toolbar.expectLoggedIn:failed');
      logMenuDebugError('toolbar.expectLoggedIn', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await logMenuDebug(this.page, 'toolbar.logout:start');
    await this.profileMenu.openWithItem(profileMenuSignoutItem);
    await this.page.locator(profileMenuSignoutItem).click();
    await logMenuDebug(this.page, 'toolbar.logout:clicked');
  }

  async expectLoggedOut(): Promise<void> {
    await logMenuDebug(this.page, 'toolbar.expectLoggedOut:start');

    await expect(async () => {
      await this.profileMenu.openWithItem(profileMenuLoginItem);
      await expect(this.page.locator(profileMenuLoginItem)).toBeVisible();
    }).toPass({ timeout: tmdbAuthStepTimeout });

    await logMenuDebug(this.page, 'toolbar.expectLoggedOut:done');
  }
}
