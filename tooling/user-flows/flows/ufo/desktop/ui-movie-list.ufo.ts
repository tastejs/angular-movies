import { Page } from 'puppeteer';
import { CwvInterface } from '../typings/cwv.interface';
import * as fixtures from '../../fixtures/ui-movie-list.fixtures';

export class UiMovieListUFO implements CwvInterface {
  protected itemSelector = fixtures.movieImgSelector;

  async clickMovieListImage(idx: number = 0) {
    const selector = this.itemSelector(idx);
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  constructor(private page: Page) {}

  async awaitAllContent(): Promise<any> {
    return await this.awaitLCPContent();
  }

  async awaitLCPContent(): Promise<any> {
    return await this.page.waitForSelector(this.itemSelector(1));
  }
}
