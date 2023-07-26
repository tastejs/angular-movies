import {CwvInterface} from '../typings/cwv.interface';
import {castImgSelector} from 'test-selectors';
import {Ufo, UserFlowContext} from '@push-based/user-flow';

export class UiCastListUFO extends Ufo implements CwvInterface {
  protected itemSelector = castImgSelector;

  // @ts-ignore
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async clickMovieListImage(idx: number) {
    const selector = this.itemSelector(idx);
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  async awaitAllContent(): Promise<any> {
    return await this.awaitLCPContent();
  }

  async awaitLCPContent(): Promise<any> {
    return await this.page.waitForSelector(this.itemSelector(1));
  }
}
