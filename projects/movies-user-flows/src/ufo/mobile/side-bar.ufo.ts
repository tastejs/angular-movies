import {SidebarUFO as DesktopSidebarUFO} from '../desktop/side-bar.ufo';
import {UserFlowContext} from '@push-based/user-flow';
import {ANIM_DURATION_SHORT, sideMenuBtnSelector,} from 'test-selectors';

export class SidebarUFO extends DesktopSidebarUFO {
  async toggelSideMenu() {
    await this.page.waitForSelector(sideMenuBtnSelector);
    await this.page.click(sideMenuBtnSelector);
    await this.page.waitForTimeout(ANIM_DURATION_SHORT);
  }

  override async navigateToCategory(
    c: string = 'popular'
  ): Promise<void> {
    await this.ensureSidebarOpen();
    await super.navigateToCategory(c);
  }

  override async navigateToGenre(g: string): Promise<void> {
    await this.ensureSidebarOpen();
    await super.navigateToGenre(g);
  }

  async ensureSidebarOpen(): Promise<void> {
    const anySideBarLink = this.categorySelector('popular');
    await this.toggelSideMenu()
      .then(() => this.page.waitForTimeout(ANIM_DURATION_SHORT))
      .then(() => this.page.waitForSelector(anySideBarLink));
  }

  override async awaitAllContent(): Promise<any> {
    await Promise.all([this.awaitLCPContent()]);
  }

  override async awaitLCPContent(): Promise<any> {
    await this.page.waitForSelector(sideMenuBtnSelector);
  }

  constructor(ctx: UserFlowContext) {
    super(ctx);
  }
}
