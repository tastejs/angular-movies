import { Page } from 'puppeteer';
import { UiMovieListUFO } from './ui-movie-list.ufo';
import { CwvInterface } from '../typings/cwv.interface';
import { BackNavigationInterface } from '../typings/back-navigation.interface';
import * as fixtures from '../../fixtures/movie-list-page.fixtures';
import { Ufo, UserFlowContext } from '@push-based/user-flow';

export class MovieListPageUFO extends Ufo implements CwvInterface {
  movieList = new UiMovieListUFO(this.ctx);

  async awaitLCPContent() {
    await this.movieList.awaitLCPContent();
  }

  async awaitHeadingContent(): Promise<void> {
    await Promise.all([
      this.page.waitForSelector(fixtures.heandlineSelector),
      this.page.waitForSelector(fixtures.subheandlineSelector),
    ]);
  }

  async awaitAllContent() {
    await Promise.all([
      this.awaitHeadingContent(),
      this.movieList.awaitAllContent(),
    ]).catch(console.log);
  }

  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async navigateToDetail(id: number = 0): Promise<any> {
    await this.movieList.clickMovieListImage(0);
  }
}
