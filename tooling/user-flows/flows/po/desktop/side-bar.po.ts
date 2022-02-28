import { Page } from 'puppeteer';

export type CategoryNames = 'popular' | 'topRated' | 'upcoming';
export const categoryNames: CategoryNames[] = [
  'popular',
  'topRated',
  'upcoming',
];
export type GenreIds = 28 | 12 | 16;
export const genreIds: GenreIds[] = [28, 12, 16];

export class SidebarPageObject {
  protected sideMenuBtnSelector = '*[data-test="sidebar--main-btn"]';

  protected categorySelector(c: CategoryNames): string {
    return `*[data-test="sidebar--link--category-${c}"]`;
  }

  protected genreSelector(g: GenreIds): string {
    return `*[data-test="sidebar--link--genre-${g}"]`;
  }

  async clickSideMenuBtn() {
    await this.page.waitForSelector(this.sideMenuBtnSelector);
    await this.page.click(this.sideMenuBtnSelector);
  }

  async navigateToCategory(c: CategoryNames = 'popular') {
    if (!categoryNames.find((i) => i === c)) {
      throw new Error('Category must be one of popular, topRated, upcoming');
    }
    await this.page.click(this.categorySelector(c));
  }

  async navigateToGenre(g: GenreIds) {
    if (!genreIds.find((i) => i === g)) {
      throw new Error('Category must be one of popular, topRated, upcoming');
    }
    await this.page.click(this.genreSelector(g));
  }

  async ensureSidebarOpen(): Promise<void> {
    const anySideBarLink = this.categorySelector('popular');
    await this.page
      .waitForSelector(anySideBarLink, { timeout: 4000 })
      .catch(() => this.page.click(this.sideMenuBtnSelector))
      .then(() => this.page.waitForSelector(anySideBarLink));
  }

  constructor(protected page: Page) {}
}
