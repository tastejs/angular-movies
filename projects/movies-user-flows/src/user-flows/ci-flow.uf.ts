import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@push-based/user-flow';

import { MovieDetailPageUFO } from '../ufo/desktop/movie-detail-page.ufo';
import { MovieListPageUFO } from '../ufo/desktop/movie-list-page.ufo';
import { SidebarUFO } from '../ufo/mobile/side-bar.ufo';

const flowOptions: UserFlowOptions = {
  name: 'Basic user flow to ensure basic functionality',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { page, flow, collectOptions } = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const sidebar = new SidebarUFO(ctx);
  const movieListPage = new MovieListPageUFO(ctx);
  const topRatedName = 'topRated';
  const movieDetailPage = new MovieDetailPageUFO(ctx);

  await flow.navigate(url, {
    stepName: 'Initial navigation',
  });
  await flow.snapshot({
    stepName: 'Initial navigation done',
  });
  await flow.startTimespan({
    stepName: 'Navigate to popular',
  });
  await sidebar.clickSideMenuBtn();
  await sidebar.navigateToCategory(topRatedName);
  await movieListPage.awaitLCPContent();
  await flow.endTimespan();
  await flow.snapshot({
    stepName: 'Navigation to popular done',
  });
  await flow.startTimespan({
    stepName: 'Navigate to detail page',
  });

  await movieListPage.navigateToDetail();
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();
  await flow.snapshot({
    stepName: 'Navigation to detail done',
  });

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
