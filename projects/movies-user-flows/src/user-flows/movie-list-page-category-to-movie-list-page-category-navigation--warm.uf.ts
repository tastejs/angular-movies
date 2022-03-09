import { SidebarUFO } from '../ufo/mobile/side-bar.ufo';
import { MovieListPageUFO } from '../ufo/desktop/movie-list-page.ufo';
import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@push-based/user-flow';

const flowOptions: UserFlowOptions = {
  name: 'Movie list page to list page  - Warm',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions, page } = ctx;
  const testUrl = `${collectOptions.url}/list/category/popular`;
  const sidebar = new SidebarUFO(ctx);
  const movieListPage = new MovieListPageUFO(ctx);
  const popularName = 'popular';
  const topRatedName = 'topRated';

  await flow.navigate(testUrl, {
    stepName: 'Page Category-Popular navigation',
  });
  await movieListPage.awaitAllContent();

  await flow.startTimespan({
    stepName: 'Page Category-Popular top-rated navigation',
  });
  await sidebar.navigateToCategory(topRatedName);
  await movieListPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Category-Popular popular navigation',
  });
  await sidebar.navigateToCategory(popularName);
  await movieListPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Category-Popular top-rated navigation',
  });
  await sidebar.navigateToCategory(topRatedName);
  await movieListPage.awaitAllContent();
  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
