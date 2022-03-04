import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@user-flow/cli';

import { MovieDetailPageUFO } from '../ufo/desktop/movie-detail-page.ufo';
import { MovieListPageUFO } from '../ufo/desktop/movie-list-page.ufo';
import { SidebarUFO } from '../ufo/mobile/side-bar.ufo';

const flowOptions: UserFlowOptions = {
  name: 'Category to Detail Navigation - Cold',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { page, flow, baseUrl } = ctx;
  const url = `${baseUrl}list/category/popular`;
  const sidebar = new SidebarUFO(page);
  const movieListPage = new MovieListPageUFO(page);
  const topRatedName = 'topRated';
  const movieDetailPage = new MovieDetailPageUFO(page);

  await flow.navigate(url, {
    stepName: 'Page Category-Popular navigation',
  });
  await flow.startTimespan({
    stepName: 'Page Category-Popular movies loaded',
  });
  await sidebar.clickSideMenuBtn();
  await sidebar.navigateToCategory(topRatedName);
  await movieListPage.awaitLCPContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Category-Popular detail navigation',
  });

  await movieListPage.navigateToDetail();
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
