import {CwvInterface} from '../typings/cwv.interface';
import {Ufo, UserFlowContext} from '@push-based/user-flow';

export type UiCastListFixtures = {
  castImgSelector: (idx: number) => string;
}

export class UiCastListUFO extends Ufo implements CwvInterface {
  private fixtures: UiCastListFixtures;
  protected itemSelector;

  // @ts-ignore
  constructor(private ctx: UserFlowContext, fixtures: UiCastListFixtures) {
    super(ctx);
    this.fixtures = fixtures;
    this.itemSelector = this.fixtures.castImgSelector;
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
