import {UiMovieListUFO} from './ui-movie-list.ufo';
import {UiCastListUFO} from './ui-cast-list.ufo';
import {CwvInterface} from '../typings/cwv.interface';
import {BackNavigationInterface} from '../typings/back-navigation.interface';
import {backBtnSelector, heandlineSelector, heroImageSelector, subheandlineSelector} from '../../../../movies/testing';
import {Ufo, UserFlowContext} from '@push-based/user-flow';

export class PersonDetailPageUFO
  extends Ufo
  implements CwvInterface, BackNavigationInterface {
  castList = new UiCastListUFO(this.ctx);
  movieList = new UiMovieListUFO(this.ctx);

  async navigateBack(): Promise<void> {
    await this.page.waitForSelector(backBtnSelector);
    await this.page.click(backBtnSelector);
  }

  async goToMovieDetail(id: number): Promise<void> {
    await this.movieList.clickMovieListImage(id);
  }

  async awaitLCPContent(): Promise<void> {
    await this.page.waitForSelector(heroImageSelector);
  }

  async getHeroImageSrc() {
    await this.page.waitForSelector(heroImageSelector);
    return await this.page.$$eval(heroImageSelector, async imgs => await imgs.map(img => img.getAttribute('src')).pop());
  }

  async awaitHeadingContent(): Promise<void> {
    await Promise.all([
      this.page.waitForSelector(heandlineSelector),
      this.page.waitForSelector(subheandlineSelector),
    ]);
  }

  async awaitAllContent(): Promise<void> {
    await Promise.all([
      this.awaitLCPContent(),
      this.awaitHeadingContent(),
      this.movieList.awaitAllContent(),
      this.castList.awaitAllContent(),
    ]);
  }

  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }
}
