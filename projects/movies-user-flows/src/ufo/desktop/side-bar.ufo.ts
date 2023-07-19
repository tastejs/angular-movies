import {CwvInterface} from '../typings/cwv.interface';
import {Ufo, UserFlowContext} from '@push-based/user-flow';
import {CategoryNames, GenreIds,} from '../../../../movies/testing';


export type SidebarFixtures = {
  ANIM_DURATION: number;
  categorySelector: (c: CategoryNames) => string;
  genreSelector: (g: GenreIds) => string;
  sideMenuBtnSelector: string;
}

export class SidebarUFO extends Ufo implements CwvInterface {
  protected categorySelector;
  protected genreSelector;

  // @ts-ignore
  constructor(private ctx: UserFlowContext, public fixtures: SidebarFixtures) {
    super(ctx);
    this.genreSelector = this.fixtures.genreSelector;
    this.categorySelector = this.fixtures.categorySelector;
  }

  async clickSideMenuBtn() {
    await this.page.waitForSelector(this.fixtures.sideMenuBtnSelector);
    await this.page.click(this.fixtures.sideMenuBtnSelector);
    await this.page.waitForTimeout(this.fixtures.ANIM_DURATION);
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
    return await Promise.all([this.page.waitForSelector(this.fixtures.sideMenuBtnSelector)]);
  }

  async awaitLCPContent(): Promise<any> {
    const anySideBarGenreLink = this.genreSelector(28);
    return await this.page.waitForSelector(anySideBarGenreLink);
  }
}
