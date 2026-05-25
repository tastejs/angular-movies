import { type Page } from '@playwright/test';
import { categorySelector, sideMenuBtnSelector } from 'test-selectors';

export class SidebarPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.locator(sideMenuBtnSelector).click();
  }

  async navigateToCategory(category: string): Promise<void> {
    await this.open();
    await this.page.locator(categorySelector(category)).click();
  }
}
