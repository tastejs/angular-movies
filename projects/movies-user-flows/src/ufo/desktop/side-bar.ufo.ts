import { CwvInterface } from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/sidebar.fixtures';
import { GenreIds, CategoryNames } from '../../internals/typings';
import { categoryNames, genreIds } from '../../internals/consts';
import { Ufo } from '@user-flow/cli';

export class SidebarUFO extends Ufo implements CwvInterface {
  protected sideMenuBtnSelector = fixtures.sideMenuBtnSelector;

  protected categorySelector = fixtures.categorySelector;

  protected genreSelector = fixtures.genreSelector;

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

  async awaitAllContent(): Promise<any> {
    return await Promise.all([
      this.page.waitForSelector(this.sideMenuBtnSelector),
    ]);
  }

  async awaitLCPContent(): Promise<any> {
    const anySideBarGenreLink = this.genreSelector(28);
    return await this.page.waitForSelector(anySideBarGenreLink);
  }
}
