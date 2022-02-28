import { Page } from 'puppeteer';
import { CwvInterface } from '../typings/cwv.interface';

export class UiCastListPageObject implements CwvInterface {
  protected itemSelector(idx: number): string {
    return `*[data-test="ui-cast-list-item-idx-${idx}"]`;
  }

  async clickMovieListImage(idx: number) {
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
