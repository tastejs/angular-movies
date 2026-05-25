import { expect, type Page } from '@playwright/test';

export class ListCreatePage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Create new list' }),
    ).toBeVisible({ timeout: 30_000 });
    await expect(this.page.locator('#list-name')).toBeVisible();
  }
}
