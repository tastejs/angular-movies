import {UiMovieListUFO} from './ui-movie-list.ufo';
import {CwvInterface} from '../typings/cwv.interface';
import {Ufo, UserFlowContext} from '@push-based/user-flow';


export type MovieListPageFixtures = {
  heandlineSelector: string;
  subheandlineSelector: string;
  movieImgSelector: (idx: number) => string
}

export class MovieListPageUFO extends Ufo implements CwvInterface {
  movieList;

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
      this.page.waitForSelector(this.fixtures.heandlineSelector, options),
      this.page.waitForSelector(this.fixtures.subheandlineSelector, options),
    ]);
  }

  async awaitAllContent() {
    await Promise.all([
      this.awaitHeadingContent(),
      this.movieList.awaitAllContent(),
    ]).catch(console.log);
  }

  constructor(private ctx: UserFlowContext, private fixtures: MovieListPageFixtures) {
    super(ctx);
    this.movieList = new UiMovieListUFO(this.ctx, {movieImgSelector: fixtures.movieImgSelector});
  }

  async navigateToDetail(id: number = 0): Promise<any> {
    await this.movieList.clickMovieListImage(id);
  }
}
