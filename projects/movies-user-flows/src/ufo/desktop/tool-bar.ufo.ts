import {CwvInterface} from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/toolbar.fixtures';
import {GenreIds} from '../../internals/typings';
import {Ufo, UserFlowContext} from '@push-based/user-flow';
import {TmdbUfo} from "./tmdb.ufo";

export class ToolBarUfo extends Ufo implements CwvInterface {
  tmdbPage: TmdbUfo;
  constructor(private ctx: UserFlowContext) {
    super(ctx);
    this.tmdbPage = new TmdbUfo(ctx);
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
    // open menu
    await this.openProfileMenu();
    // navigate to tmdb
    await this.page.waitForSelector(fixtures.profileMenuLoginItem);
    await this.page.click(fixtures.profileMenuLoginItem);

    await this.page.waitForRequest((req) => req.url().includes(fixtures.TmdbAuthUrl))
      .catch(() => {
        throw new Error('Navigation to tmdb failed')
      });

    await this.tmdbPage.login();

    if (!this.page.url().includes('angular-movies')) {
      throw new Error('Navigation mack to movies app failed')
    }
  }

  async awaitLCPContent(): Promise<any> {
    throw new Error('not implemented');
  }

  awaitAllContent(): Promise<any> {
    throw new Error('not implemented');
  }
}
