import {CwvInterface} from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/toolbar.fixtures';
import * as tmdbfixtures from '../../fixtures/tmdb.fixtures';
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


  async goToTmDbLogin(): Promise<any> {
    // open menu
    await this.openProfileMenu();
    // navigate to tmdb
    await this.page.waitForSelector(fixtures.profileMenuLoginItem);
    await this.page.click(fixtures.profileMenuLoginItem);

    await this.page.waitForResponse(r => r.url().includes(tmdbfixtures.TmdbAuthUrl))
      .catch(() => {
        throw new Error('Navigation to tmdb failed')
      });
  }

  async ensureLoginDone(): Promise<any> {
    // navigate back to movies app
    await this.page.waitForResponse(r => r.url().includes('angular'));
    // open menu
    await this.openProfileMenu()
    await this.page.waitForSelector(fixtures.profileMenuSignoutItem);
  }

  async awaitLCPContent(): Promise<any> {
    throw new Error('not implemented');
  }

  awaitAllContent(): Promise<any> {
    throw new Error('not implemented');
  }
}
