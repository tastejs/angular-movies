import {UiMovieListUFO} from './ui-movie-list.ufo';
import {UiCastListUFO} from './ui-cast-list.ufo';
import {CwvInterface} from '../typings/cwv.interface';
import {BackNavigationInterface} from '../typings/back-navigation.interface';
import {Ufo, UserFlowContext} from '@push-based/user-flow';

export type MovieDetailPageFixture = {
  backBtnSelector: string;
  castImgSelector: (idx: number) => string
  heandlineSelector: string
  heroImageSelector: string
  subheandlineSelector: string;
  movieImgSelector: (idx: number) => string
}

export class MovieDetailPageUFO
  extends Ufo
  implements CwvInterface, BackNavigationInterface {
  castList;
  movieList;

  async navigateBack(): Promise<void> {
    await this.page.waitForSelector(this.fixtures.backBtnSelector);
    await this.page.click(this.fixtures.backBtnSelector);
  }

  async goToPersonDetail(id: number): Promise<void> {
    await this.castList.clickMovieListImage(id);
  }

  async goToMovieDetail(id: number): Promise<void> {
    await this.movieList.clickMovieListImage(id);
  }

  async awaitLCPContent(): Promise<void> {
    await this.page.waitForSelector(this.fixtures.heroImageSelector);
  }

  async awaitHeadingContent(): Promise<void> {
    await Promise.all([
      this.page.waitForSelector(this.fixtures.heandlineSelector),
      this.page.waitForSelector(this.fixtures.subheandlineSelector),
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

  constructor(private ctx: UserFlowContext, private fixtures: MovieDetailPageFixture) {
    super(ctx);
    this.castList = new UiCastListUFO(this.ctx, {castImgSelector: fixtures.castImgSelector});
    this.movieList = new UiMovieListUFO(this.ctx, {movieImgSelector: fixtures.movieImgSelector});
  }
}
