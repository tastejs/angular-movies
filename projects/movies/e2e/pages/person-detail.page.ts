import { expect, type Page } from '@playwright/test';
import { heroImageSelector } from 'test-selectors';

export class PersonDetailPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page.locator(heroImageSelector)).toBeVisible({
      timeout: 30_000,
    });
  }
}
