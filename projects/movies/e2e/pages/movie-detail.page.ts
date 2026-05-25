import { expect, type Page } from '@playwright/test';
import {
  backBtnSelector,
  castImgSelector,
  heandlineSelector,
  heroImageSelector,
  subheandlineSelector,
} from 'test-selectors';

export class MovieDetailPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page.locator(heroImageSelector)).toBeVisible({
      timeout: 30_000,
    });
    await expect(this.page.locator(heandlineSelector)).toBeVisible();
    await expect(this.page.locator(subheandlineSelector)).toBeVisible();
  }

  async expectCastVisible(): Promise<void> {
    await expect(this.page.locator(castImgSelector(0))).toBeVisible({
      timeout: 30_000,
    });
  }

  async openCastAt(index: number): Promise<void> {
    await this.page.locator(castImgSelector(index)).click();
  }

  async goBack(): Promise<void> {
    await this.page.locator(backBtnSelector).click();
  }

  async expectHeroHidden(): Promise<void> {
    await expect(this.page.locator(heroImageSelector)).toBeHidden({
      timeout: 5_000,
    });
  }

  async expectLoaderVisible(): Promise<void> {
    await expect(this.page.locator('.loader').first()).toBeVisible({
      timeout: 30_000,
    });
  }
}
