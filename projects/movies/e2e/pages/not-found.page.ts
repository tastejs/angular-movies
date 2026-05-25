import { expect, type Page } from '@playwright/test';

export class NotFoundPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Sorry, page not found' }),
    ).toBeVisible({ timeout: 30_000 });
  }

  async goToPopular(): Promise<void> {
    await this.page.getByRole('link', { name: 'See popular' }).click();
  }
}
