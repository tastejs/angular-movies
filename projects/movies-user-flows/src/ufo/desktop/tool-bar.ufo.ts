import {CwvInterface} from '../typings/cwv.interface';
import * as tmdbfixtures from '../../fixtures/tmdb.fixtures';
import {Ufo, UserFlowContext} from '@push-based/user-flow';
import {TmdbUfo} from './tmdb.ufo';
import {GenreIds} from "../../../../movies/testing";

export type ToolbarFixtures = {
  searchSelector: string;
  searchSubmitKeys: string[];
  profileMenu: string;
  profileMenuContent: string;
  profileMenuLoginItem: string;
  profileMenuSignoutItem: string;
}

export class ToolBarUfo extends Ufo implements CwvInterface {
  fixtures: ToolbarFixtures;
  tmdbPage: TmdbUfo;

  // @ts-ignore
  constructor(private ctx: UserFlowContext, fixtures: ToolbarFixtures) {
    super(ctx);
    this.fixtures = fixtures;
    this.tmdbPage = new TmdbUfo(ctx);
  }

  async sendSearchForm() {
    await this.page.keyboard.type(this.fixtures.searchSubmitKeys[0]);
  }

  async fillSearchForm(query: string = 'pocahontas') {
    await this.page.waitForSelector(this.fixtures.searchSelector);
    await this.page.keyboard.type(query);
  }

  async toggleDarkMode(_: GenreIds) {
    throw new Error('not implemented');
  }

  async openProfileMenu(): Promise<any> {
    await this.page.waitForSelector(this.fixtures.profileMenu);
    await this.page.click(this.fixtures.profileMenu);
    await this.page.waitForSelector(this.fixtures.profileMenuContent);
  }

  async goToTmDbLogin(): Promise<any> {
    // open menu
    await this.openProfileMenu();
    // navigate to tmdb
    await this.page.waitForSelector(this.fixtures.profileMenuLoginItem);
    await this.page.click(this.fixtures.profileMenuLoginItem);

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
    await this.page.waitForSelector(this.fixtures.profileMenuSignoutItem);
  }

  async logout(): Promise<any> {
    // open menu
    await this.openProfileMenu();
    await this.page.waitForSelector(this.fixtures.profileMenuSignoutItem);
    await this.page.click(this.fixtures.profileMenuSignoutItem);
  }

  async ensureLogoutDone(): Promise<any> {
    // open menu
    await this.openProfileMenu();
    await this.page.waitForSelector(this.fixtures.profileMenuLoginItem);
  }

  async awaitLCPContent(): Promise<any> {
    throw new Error('not implemented');
  }

  awaitAllContent(): Promise<any> {
    throw new Error('not implemented');
  }
}
