import { CwvInterface } from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/sidebar.fixtures';
import { GenreIds, CategoryNames } from '../../internals/typings';
import { Ufo, UserFlowContext } from '@push-based/user-flow';

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
    await this.page.click(this.categorySelector(c));
  }

  async navigateToGenre(g: GenreIds) {
    await this.page.click(this.genreSelector(g));
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
