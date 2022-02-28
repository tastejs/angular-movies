import { Page } from 'puppeteer';
import { UiMovieListPageObject } from './ui-movie-list.po';
import { CwvInterface } from '../typings/cwv.interface';

export class MovieListPagePageObject implements CwvInterface {
  protected heandlineSelector = '*[data-test="movie-list--header-main"]';
  protected subheandlineSelector = '*[data-test="movie-list--header-sub"]';
  movieList = new UiMovieListPageObject(this.page);

  async awaitLCPContent() {
    await this.movieList.awaitLCPContent();
  }

  async awaitAllContent() {
    await Promise.all([
      this.page.waitForSelector(this.heandlineSelector),
      this.page.waitForSelector(this.subheandlineSelector),
      this.movieList.awaitAllContent(),
    ]);
  }

  constructor(private page: Page) {}
}
