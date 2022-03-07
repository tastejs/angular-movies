import { CwvInterface } from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/sidebar.fixtures';
import { GenreIds, CategoryNames } from '../../internals/typings';
import { categoryNames, genreIds } from '../../internals/consts';
import { Ufo, UserFlowContext } from '@push-based/user-flow';
import { Page } from 'puppeteer';

export class SidebarUFO extends Ufo implements CwvInterface {
  protected categorySelector = fixtures.categorySelector;
  protected genreSelector = fixtures.genreSelector;

  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async clickSideMenuBtn() {
    await this.page.waitForSelector(fixtures.sideMenuBtnSelector);
    await this.page.click(fixtures.sideMenuBtnSelector);
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
      .catch(() => this.page.click(fixtures.sideMenuBtnSelector))
      .then(() => this.page.waitForSelector(anySideBarLink));
  }

  async awaitAllContent(): Promise<any> {
    return await Promise.all([
      this.page.waitForSelector(fixtures.sideMenuBtnSelector),
    ]);
  }

  async awaitLCPContent(): Promise<any> {
    const anySideBarGenreLink = this.genreSelector(28);
    return await this.page.waitForSelector(anySideBarGenreLink);
  }
}
