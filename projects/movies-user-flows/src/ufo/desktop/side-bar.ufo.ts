import { CwvInterface } from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/sidebar.fixtures';
import { GenreIds, CategoryNames } from '../../internals/typings';
import { Ufo, UserFlowContext } from '@push-based/user-flow';
import { ANIM_DURATION_STANDARD } from '../../fixtures/animations';

export class SidebarUFO extends Ufo implements CwvInterface {
  protected categorySelector = fixtures.categorySelector;
  protected genreSelector = fixtures.genreSelector;

  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async clickSideMenuBtn() {
    await this.page.waitForSelector(fixtures.sideMenuBtnSelector);
    await this.page.click(fixtures.sideMenuBtnSelector);
    await this.page.waitForTimeout(ANIM_DURATION_STANDARD);
  }

  async navigateToCategory(c: CategoryNames = 'popular') {
    const selector = this.categorySelector(c);
    await this.page.waitForSelector(selector).then(() =>
      this.page.click(selector).catch(() => {
        throw new Error(
          `Selector ${selector} is either not clickable or not an HTMLElement`
        );
      })
    );
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
