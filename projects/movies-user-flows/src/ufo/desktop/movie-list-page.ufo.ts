import {UiMovieListUFO} from './ui-movie-list.ufo';
import {CwvInterface} from '../typings/cwv.interface';
import {heandlineSelector, movieImgSelector, subheandlineSelector,} from '../../../../movies/testing';
import {Ufo, UserFlowContext} from '@push-based/user-flow';

export class MovieListPageUFO extends Ufo implements CwvInterface {
  movieList = new UiMovieListUFO(this.ctx, {movieImgSelector});

  async awaitLCPContent() {
    await this.movieList.awaitLCPContent();
  }

  async awaitHeadingContent(
    options: {
      visible?: boolean;
      hidden?: boolean;
      timeout?: number;
    } = {}
  ): Promise<void> {
    await Promise.all([
      this.page.waitForSelector(heandlineSelector, options),
      this.page.waitForSelector(subheandlineSelector, options),
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
    await this.movieList.clickMovieListImage(id);
  }
}
