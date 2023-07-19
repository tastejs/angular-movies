import {SidebarFixtures, SidebarUFO as DesktopSidebarUFO} from '../desktop/side-bar.ufo';
import {UserFlowContext} from '@push-based/user-flow';
import {CategoryNames, GenreIds} from '../../../../movies/testing';

export class SidebarUFO extends DesktopSidebarUFO {
  async toggelSideMenu() {
    await this.page.waitForSelector(this.fixtures.sideMenuBtnSelector);
    await this.page.click(this.fixtures.sideMenuBtnSelector);
    await this.page.waitForTimeout(this.fixtures.ANIM_DURATION);
  }

  override async navigateToCategory(
    c: CategoryNames = 'popular'
  ): Promise<void> {
    await this.ensureSidebarOpen();
    await super.navigateToCategory(c);
  }

  override async navigateToGenre(g: GenreIds): Promise<void> {
    await this.ensureSidebarOpen();
    await super.navigateToGenre(g);
  }

  async ensureSidebarOpen(): Promise<void> {
    const anySideBarLink = this.categorySelector('popular');
    await this.toggelSideMenu()
      .then(() => this.page.waitForTimeout(this.fixtures.ANIM_DURATION))
      .then(() => this.page.waitForSelector(anySideBarLink));
  }

  override async awaitAllContent(): Promise<any> {
    await Promise.all([this.awaitLCPContent()]);
  }

  override async awaitLCPContent(): Promise<any> {
    await this.page.waitForSelector(this.fixtures.sideMenuBtnSelector);
  }

  constructor(ctx: UserFlowContext, fixtures: SidebarFixtures) {
    super(ctx, fixtures);
  }
}
