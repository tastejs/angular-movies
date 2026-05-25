import { expect, type Page } from '@playwright/test';
import {
  profileMenu,
  profileMenuContent,
  profileMenuLoginItem,
  profileMenuSignoutItem,
} from 'test-selectors';
import { logMenuDebug, logMenuDebugError } from '../fixtures/menu-debug';

/**
 * Account menu behaviour (see app-shell.component.html + account-menu.component.ts):
 * - @defer loads app-account-menu on hover(profileMenuButton); shows "Loading..." until then
 * - .profile-menu-content is visibility:hidden until .account-menu-dropdown:hover
 * - loggedIn() may be undefined briefly; guest UI can flash before Logout links after OAuth
 */
export class ProfileMenuPage {
  constructor(private readonly page: Page) {}

  private dropdown() {
    return this.page.locator('.account-menu-dropdown');
  }

  private expectsLoggedIn(itemSelector: string): boolean {
    return itemSelector.includes('signout');
  }

  /**
   * Step 1: hover the profile control so @defer loads the lazy account-menu chunk.
   */
  async hoverOpen(): Promise<void> {
    const menuButton = this.page.locator(profileMenu);

    await logMenuDebug(this.page, 'hoverOpen:start');

    // Move off the page first so hover is reliable after returning from external TMDB OAuth.
    await this.page.mouse.move(0, 0);
    await logMenuDebug(this.page, 'hoverOpen:after-mouse-reset');

    await menuButton.scrollIntoViewIfNeeded();
    await logMenuDebug(this.page, 'hoverOpen:after-scroll-into-view');

    await menuButton.hover();
    await logMenuDebug(this.page, 'hoverOpen:after-button-hover');

    try {
      await this.page.locator('app-account-menu').waitFor({
        state: 'attached',
        timeout: 30_000,
      });
      await logMenuDebug(this.page, 'hoverOpen:account-menu-attached');
    } catch (error) {
      await logMenuDebug(this.page, 'hoverOpen:account-menu-missing');
      logMenuDebugError('hoverOpen:account-menu-wait', error);
      throw error;
    }

    await this.dropdown().hover();
    await logMenuDebug(this.page, 'hoverOpen:after-dropdown-hover');
  }

  /**
   * Step 2: wait until the correct guest/logged-in template is in the DOM (not the other).
   * Must run while the menu is hovered so @defer stays active.
   */
  async waitForAccountMenuState(loggedIn: boolean): Promise<void> {
    const expectedItem = loggedIn
      ? profileMenuSignoutItem
      : profileMenuLoginItem;
    const staleItem = loggedIn ? profileMenuLoginItem : profileMenuSignoutItem;

    await logMenuDebug(this.page, 'waitForAccountMenuState:start', {
      loggedIn,
      expectedItem,
      staleItem,
    });

    let attempt = 0;

    await expect(async () => {
      attempt += 1;
      await this.dropdown().hover();
      await logMenuDebug(this.page, 'waitForAccountMenuState:poll', {
        attempt,
        loggedIn,
      });

      try {
        await expect(this.page.locator(expectedItem)).toBeVisible();
        await expect(this.page.locator(staleItem)).toHaveCount(0);
      } catch (error) {
        logMenuDebugError(`waitForAccountMenuState:poll-${attempt}`, error);
        throw error;
      }
    }).toPass({ timeout: 30_000 });

    await this.dropdown().hover();
    await logMenuDebug(this.page, 'waitForAccountMenuState:done', { loggedIn });
  }

  /**
   * Step 3: the menu panel is CSS-visible (dropdown still hovered).
   */
  async waitForMenuPanel(): Promise<void> {
    await logMenuDebug(this.page, 'waitForMenuPanel:start');

    try {
      await this.page.locator(profileMenuContent).waitFor({
        state: 'visible',
        timeout: 30_000,
      });
      await logMenuDebug(this.page, 'waitForMenuPanel:visible');
    } catch (error) {
      await logMenuDebug(this.page, 'waitForMenuPanel:not-visible');
      logMenuDebugError('waitForMenuPanel', error);
      throw error;
    }

    await this.dropdown().hover();
  }

  /**
   * Step 4: the target entry is visible; hover it for the upcoming click.
   */
  async waitForMenuItem(itemSelector: string): Promise<void> {
    await logMenuDebug(this.page, 'waitForMenuItem:start', { itemSelector });

    const item = this.page.locator(itemSelector);

    try {
      await item.waitFor({ state: 'visible', timeout: 30_000 });
      await logMenuDebug(this.page, 'waitForMenuItem:visible', {
        itemSelector,
      });
    } catch (error) {
      logMenuDebugError('waitForMenuItem', error);
      throw error;
    }

    await this.dropdown().hover();
    await item.hover();
    await logMenuDebug(this.page, 'waitForMenuItem:ready', { itemSelector });
  }

  /** Open the panel only (no particular item required). */
  async open(): Promise<void> {
    await logMenuDebug(this.page, 'open:start');
    await this.hoverOpen();
    await this.waitForMenuPanel();
    await logMenuDebug(this.page, 'open:done');
  }

  /** Full open flow: hover → correct template → panel → specific item. */
  async openWithItem(itemSelector: string): Promise<void> {
    const loggedIn = this.expectsLoggedIn(itemSelector);
    await logMenuDebug(this.page, 'openWithItem:start', {
      itemSelector,
      loggedIn,
    });

    await this.hoverOpen();
    await this.waitForAccountMenuState(loggedIn);
    await this.waitForMenuPanel();
    await this.waitForMenuItem(itemSelector);

    await logMenuDebug(this.page, 'openWithItem:done', {
      itemSelector,
      loggedIn,
    });
  }
}
