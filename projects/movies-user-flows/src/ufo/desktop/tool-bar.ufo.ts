import {CwvInterface} from '../typings/cwv.interface';
import {
  profileMenu,
  profileMenuContent,
  profileMenuLoginItem,
  profileMenuSignoutItem,
  searchSelector,
  searchSubmitKeys,
} from 'test-selectors';
import * as tmdbfixtures from '../../fixtures/tmdb.fixtures';
import {Ufo, UserFlowContext} from '@push-based/user-flow';
import {TmdbUfo} from './tmdb.ufo';

export class ToolBarUfo extends Ufo implements CwvInterface {
  tmdbPage: TmdbUfo;

  // @ts-ignore
  constructor(private ctx: UserFlowContext) {
    super(ctx);
    this.tmdbPage = new TmdbUfo(ctx);
  }

  async sendSearchForm() {
    await this.page.keyboard.type(searchSubmitKeys[0]);
  }

  async fillSearchForm(query: string = 'pocahontas') {
    await this.page.waitForSelector(searchSelector);
    await this.page.keyboard.type(query);
  }

  async toggleDarkMode() {
    throw new Error('not implemented');
  }

  async openProfileMenu(): Promise<any> {
    await this.page.waitForSelector(profileMenu);
    await this.page.click(profileMenu);
    await this.page.waitForSelector(profileMenuContent);
  }

  async goToTmDbLogin(): Promise<any> {
    // open menu
    await this.openProfileMenu();
    // navigate to tmdb
    await this.page.waitForSelector(profileMenuLoginItem);
    await this.page.click(profileMenuLoginItem);

    await this.page
      .waitForResponse((r) => r.url().includes(tmdbfixtures.TmdbAuthUrl))
      .catch(() => {
        throw new Error('Navigation to tmdb failed');
      });
  }

  async ensureLoginDone(): Promise<any> {
    // navigate back to movies app
    await this.page.waitForResponse((r) => r.url().includes('angular'));
    // open menu
    await this.openProfileMenu();
    await this.page.waitForSelector(profileMenuSignoutItem);
  }

  async logout(): Promise<any> {
    // open menu
    await this.openProfileMenu();
    await this.page.waitForSelector(profileMenuSignoutItem);
    await this.page.click(profileMenuSignoutItem);
  }

  async ensureLogoutDone(): Promise<any> {
    // open menu
    await this.openProfileMenu();
    await this.page.waitForSelector(profileMenuLoginItem);
  }

  async awaitLCPContent(): Promise<any> {
    throw new Error('not implemented');
  }

  awaitAllContent(): Promise<any> {
    throw new Error('not implemented');
  }
}
