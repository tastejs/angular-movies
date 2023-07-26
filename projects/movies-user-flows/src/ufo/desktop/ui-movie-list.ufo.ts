import {CwvInterface} from '../typings/cwv.interface';
import {movieImgSelector} from '../../../../test-selectors/src';
import {Ufo, UserFlowContext} from '@push-based/user-flow';

export class UiMovieListUFO extends Ufo implements CwvInterface {
  protected itemSelector = movieImgSelector;

  async clickMovieListImage(idx: number = 0) {
    const selector = this.itemSelector(idx);
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  // @ts-ignore
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async awaitAllContent(): Promise<any> {
    return await this.awaitLCPContent();
  }

  async awaitLCPContent(): Promise<any> {
    return await this.page.waitForSelector(this.itemSelector(1));
  }
}
