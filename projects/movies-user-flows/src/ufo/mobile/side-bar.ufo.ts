import { Page } from 'puppeteer';
import { SidebarUFO as DesktopSidebarUFO } from '../desktop/side-bar.ufo';
import { UserFlowContext } from '@push-based/user-flow';
import * as fixtures from '../../fixtures/sidebar.fixtures';

export type CategoryNames = 'popular' | 'topRated' | 'upcoming';
export const categoryNames: CategoryNames[] = [
  'popular',
  'topRated',
  'upcoming',
];
export type GenreIds = 28 | 12 | 16;
export const genreIds: GenreIds[] = [28, 12, 16];

export class SidebarUFO extends DesktopSidebarUFO {
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
      .catch(() => this.page.click(fixtures.sideMenuBtnSelector))
      .then(() => this.page.waitForSelector(anySideBarLink));
  }

  async awaitAllContent(): Promise<any> {
    return await Promise.all([this.awaitLCPContent()]);
  }

  async awaitLCPContent(): Promise<any> {
    return await this.page.waitForSelector(fixtures.sideMenuBtnSelector);
  }

  constructor(ctx: UserFlowContext) {
    super(ctx);
  }
}
