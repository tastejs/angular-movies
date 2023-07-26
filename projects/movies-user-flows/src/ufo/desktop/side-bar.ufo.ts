import {CwvInterface} from '../typings/cwv.interface';
import {Ufo, UserFlowContext} from '@push-based/user-flow';
import {
  ANIM_DURATION_STANDARD,
  categorySelector,
  genreSelector,
  sideMenuBtnSelector,
} from '../../../../test-selectors/src';

export class SidebarUFO extends Ufo implements CwvInterface {
  protected categorySelector = categorySelector;
  protected genreSelector = genreSelector;

  // @ts-ignore
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async clickSideMenuBtn() {
    await this.page.waitForSelector(sideMenuBtnSelector);
    await this.page.click(sideMenuBtnSelector);
    await this.page.waitForTimeout(ANIM_DURATION_STANDARD);
  }

  async navigateToCategory(c: string = 'popular') {
    const selector = this.categorySelector(c);
    await this.page.waitForSelector(selector).then(() =>
      this.page.click(selector).catch(() => {
        throw new Error(
          `Selector ${selector} is either not clickable or not an HTMLElement`
        );
      })
    );
  }

  async navigateToGenre(g: string) {
    await this.page.click(this.genreSelector(g));
  }

  async awaitAllContent(): Promise<any> {
    return await Promise.all([this.page.waitForSelector(sideMenuBtnSelector)]);
  }

  async awaitLCPContent(): Promise<any> {
    const anySideBarGenreLink = this.genreSelector('28');
    return await this.page.waitForSelector(anySideBarGenreLink);
  }
}
