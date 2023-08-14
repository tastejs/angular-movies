import {getLhConfig} from '../../movies-user-flows/src/internals/test-sets';

import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';
import {mergeBudgets, MovieDetailPageUFO, MovieListPageUFO, SidebarUFO,} from '../../movies-user-flows/src';

import Budget from 'lighthouse/types/lhr/budget';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const angularBudgets: Budget[] = require('../../testing/budgets/angular.budgets.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const generalTimingBudget: Budget[] = require('../../testing/budgets/general-timing.budgets.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const movieListBudgets: Budget[] = require('../../testing/budgets/movie-list.budgets.json');

const flowOptions: UserFlowOptions = {
  name: 'Firebase Function Emulation',
};

const interactions: UserFlowInteractionsFn = async (
  context: UserFlowContext
): Promise<any> => {
  const {flow, collectOptions} = context;
  const url = `${collectOptions.url}/list/category/popular`;
  const sidebar = new SidebarUFO(context);
  const movieListPage = new MovieListPageUFO(context);
  const topRatedName = 'topRated';
  const movieDetailPage = new MovieDetailPageUFO(context);

  const cfg = mergeBudgets([
    angularBudgets,
    generalTimingBudget,
    movieListBudgets,
  ]);
  await flow.navigate(url, {
    stepName: '🧭 Initial navigation',
    config: getLhConfig(cfg),
  });
  await flow.snapshot({
    stepName: '✔ Initial navigation done',
  });
  await flow.startTimespan({
    stepName: '🧭 Navigate to popular',
  });

  await sidebar.clickSideMenuBtn();
  await sidebar.navigateToCategory(topRatedName);
  await movieListPage.awaitLCPContent();
  await flow.endTimespan();
  await flow.snapshot({
    stepName: '✔ Navigation to popular done',
  });
  await flow.startTimespan({
    stepName: '🧭 Navigate to detail page',
  });

  await movieListPage.navigateToDetail();
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();
  await flow.snapshot({
    stepName: '✔ Navigation to detail done',
  });

  return;
};

export const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

export default userFlowProvider;
