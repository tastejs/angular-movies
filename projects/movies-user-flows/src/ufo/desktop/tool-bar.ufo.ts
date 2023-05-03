import {CwvInterface} from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/toolbar.fixtures';
import {GenreIds} from '../../internals/typings';
import {Ufo, UserFlowContext} from '@push-based/user-flow';


export class ToolBarUfo extends Ufo implements CwvInterface {
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async sendSearchForm() {
    await this.page.keyboard.type(fixtures.searchSubmitKeys[0]);
  }

  async fillSearchForm(query: string = 'pocahontas') {
    await this.page.waitForSelector(fixtures.searchSelector);
    await this.page.keyboard.type(query);
  }

  async toggleDarkMode(g: GenreIds) {
    throw new Error('not implemented');
  }

  async openProfileMenu(): Promise<any> {
    await this.page.waitForSelector(fixtures.profileMenu);
    await this.page.click(fixtures.profileMenu);
    await this.page.waitForSelector(fixtures.profileMenuContent);
  }

  async login(): Promise<any> {
    await this.page.waitForSelector(fixtures.profileMenuContent);
    await this.page.click(fixtures.profileMenuLoginItem);
    await this.page.waitForNavigation()
    if (!this.page.url().includes(fixtures.TmdbAuthUrl)) {
      throw new Error('Login page not open')
    }
    await this.page.click(fixtures.TmdbApproveBtn);
    await this.page.waitForNavigation()
    if (!this.page.url().includes('angular')) {
      throw new Error('redirect from login back not working')
    }
  }

  async awaitLCPContent(): Promise<any> {
    throw new Error('not implemented');
  }

  awaitAllContent(): Promise<any> {
    throw new Error('not implemented');
  }
}
