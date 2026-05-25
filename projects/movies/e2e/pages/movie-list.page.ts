import { expect, type Page } from '@playwright/test';
import { heandlineSelector, movieImgSelector } from 'test-selectors';

export class MovieListPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page.locator(heandlineSelector)).toBeVisible({
      timeout: 30_000,
    });
    await expect(this.page.locator(movieImgSelector(0))).toBeVisible({
      timeout: 30_000,
    });
  }

  async openMovieAt(index: number): Promise<void> {
    await this.page.locator(movieImgSelector(index)).click();
  }
}
