import { Page } from 'puppeteer';
import { SidebarPageObject as DesktopSidebarPageObject } from '../desktop/side-bar.po';

export type CategoryNames = 'popular' | 'topRated' | 'upcoming';
export const categoryNames: CategoryNames[] = [
  'popular',
  'topRated',
  'upcoming',
];
export type GenreIds = 28 | 12 | 16;
export const genreIds: GenreIds[] = [28, 12, 16];

export class SidebarPageObject extends DesktopSidebarPageObject {
  async navigateToCategory(c: CategoryNames = 'popular') {
    this.ensureSidebarOpen();
    super.navigateToCategory(c);
  }

  async navigateToGenre(g: GenreIds) {
    this.ensureSidebarOpen();
    super.navigateToGenre(g);
  }

  async ensureSidebarOpen(): Promise<void> {
    const anySideBarLink = this.categorySelector('popular');
    await this.page
      .waitForSelector(anySideBarLink, { timeout: 4000 })
      .catch(() => this.page.click(this.sideMenuBtnSelector))
      .then(() => this.page.waitForSelector(anySideBarLink));
  }

  constructor(page: Page) {
    super(page);
  }
}
