import { expect, type Page } from '@playwright/test';
import { searchFormSelector, searchSelector } from 'test-selectors';
import { ProfileMenuPage } from './profile-menu.page';

export class AppShellPage {
  private readonly profileMenu: ProfileMenuPage;

  constructor(private readonly page: Page) {
    this.profileMenu = new ProfileMenuPage(page);
  }

  async search(term: string): Promise<void> {
    await this.page.locator(searchFormSelector).click();
    const input = this.page.locator(searchSelector);
    await input.fill(term);
    await input.press('Tab');
    await this.page.locator(searchFormSelector).evaluate((form) => {
      (form as HTMLFormElement).requestSubmit();
    });
  }

  async enableDarkMode(): Promise<void> {
    const body = this.page.locator('body');
    if (await body.evaluate((el) => el.classList.contains('dark'))) {
      return;
    }
    await this.page.locator('#dark-mode').evaluate((el: HTMLInputElement) => {
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(body).toHaveClass(/dark/);
  }

  async enableLightMode(): Promise<void> {
    const body = this.page.locator('body');
    if (await body.evaluate((el) => el.classList.contains('light'))) {
      return;
    }
    await this.page.locator('#dark-mode').evaluate((el: HTMLInputElement) => {
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(body).toHaveClass(/light/);
  }

  async openProfileMenu(): Promise<void> {
    await this.profileMenu.open();
  }

  async goToMyLists(): Promise<void> {
    await this.profileMenu.open();
    const myLists = this.page.getByRole('link', { name: 'My Lists' });
    await myLists.waitFor({ state: 'visible', timeout: 30_000 });
    await myLists.click();
  }

  async goToCreateList(): Promise<void> {
    await this.profileMenu.open();
    const createList = this.page.getByRole('link', { name: 'Create New List' });
    await createList.waitFor({ state: 'visible', timeout: 30_000 });
    await createList.click();
  }
}
