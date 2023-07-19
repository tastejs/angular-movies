import {CwvInterface} from '../typings/cwv.interface';
import {Ufo, UserFlowContext} from '@push-based/user-flow';

export class UiMovieListUFO extends Ufo implements CwvInterface {
  protected itemSelector;

  async clickMovieListImage(idx: number = 0) {
    const selector = this.itemSelector(idx);
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  // @ts-ignore
  constructor(private ctx: UserFlowContext, private fixtures: { movieImgSelector: (idx: number) => string }) {
    super(ctx);
    this.itemSelector = this.fixtures.movieImgSelector
  }

  async awaitAllContent(): Promise<any> {
    return await this.awaitLCPContent();
  }

  async awaitLCPContent(): Promise<any> {
    return await this.page.waitForSelector(this.itemSelector(1));
  }
}
