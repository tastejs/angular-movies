import { Page } from 'puppeteer';
import { UiMovieListUFO } from './ui-movie-list.ufo';
import { UiCastListUFO } from './ui-cast-list.ufo';
import { CwvInterface } from '../typings/cwv.interface';
import { BackNavigationInterface } from '../typings/back-navigation.interface';
import * as fixtures from '../../fixtures/movie-detail-page.fixtures';

export class MovieDetailPageUFO
  implements CwvInterface, BackNavigationInterface
{
  castList = new UiCastListUFO(this.page);
  movieList = new UiMovieListUFO(this.page);

  async navigateBack(): Promise<void> {
    await this.page.waitForSelector(fixtures.backBtnSelector);
    await this.page.click(fixtures.backBtnSelector);
  }

  async goToPersonDetail(id: number): Promise<void> {
    await this.castList.clickMovieListImage(id);
  }

  async goToMovieDetail(id: number): Promise<void> {
    await this.movieList.clickMovieListImage(id);
  }

  async awaitLCPContent(): Promise<void> {
    await this.page.waitForSelector(fixtures.heroImageSelector);
  }

  async awaitHeadingContent(): Promise<void> {
    await Promise.all([
      this.page.waitForSelector(fixtures.heandlineSelector),
      this.page.waitForSelector(fixtures.subheandlineSelector),
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

  constructor(private page: Page) {}
}
