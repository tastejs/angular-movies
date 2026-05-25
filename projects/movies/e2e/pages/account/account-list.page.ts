import { expect, type Page } from '@playwright/test';

export class AccountListPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'My Lists' }),
    ).toBeVisible({ timeout: 30_000 });
  }
}
