import { Page } from 'puppeteer';
import { UiMovieListPageObject } from './ui-movie-list.po';
import { CwvInterface } from '../typings/cwv.interface';
import { BackNavigationInterface } from '../typings/back-navigation.interface';
import { UiCastListPageObject } from './ui-cast-list.po';

export class MovieDetailPagePageObject
  implements CwvInterface, BackNavigationInterface
{
  backBtnSelector = '*[data-test="movie-detail--btn-back"]';
  protected heandlineSelector = '*[data-test="movie-detail--header-main"]';
  protected subheandlineSelector = '*[data-test="movie-detail--header-sub"]';
  protected heroImageSelector = '*[data-test="movie-detail--hero-img"]';

  castList = new UiCastListPageObject(this.page);
  movieList = new UiMovieListPageObject(this.page);

  async navigateBack(): Promise<void> {
    await this.page.waitForSelector(this.backBtnSelector);
    await this.page.click(this.backBtnSelector);
  }

  async goToPersonDetail(id: number): Promise<void> {
    await this.castList.clickMovieListImage(id);
  }

  async goToMovieDetail(id: number): Promise<void> {
    await this.movieList.clickMovieListImage(id);
  }

  async awaitLCPContent(): Promise<void> {
    await this.page.waitForSelector(this.heroImageSelector);
  }

  async awaitAllContent(): Promise<void> {
    await Promise.all([
      this.page.waitForSelector(this.heandlineSelector),
      this.page.waitForSelector(this.subheandlineSelector),
      this.movieList.awaitAllContent(),
    ]);
  }

  constructor(private page: Page) {}
}
