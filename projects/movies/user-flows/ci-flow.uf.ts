import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';

import {mergeBudgets, MovieDetailPageUFO, MovieListPageUFO, SidebarUFO,} from '../../movies-user-flows/src';
import {getLhConfig} from '../../movies-user-flows/src/internals/test-sets';
import * as angularBudgets from '../testing/budgets/angular.budgets.json';
import * as generalTimingBudget from '../testing/budgets/general-timing.budgets.json';
import * as movieListBudgets from '../testing/budgets/movie-list.budgets.json';
import Budget from 'lighthouse/types/lhr/budget';
import {
  ANIM_DURATION_STANDARD,
  categorySelector,
  genreSelector,
  heandlineSelector,
  movieImgSelector,
  sideMenuBtnSelector,
  subheandlineSelector
} from "../testing";

const flowOptions: UserFlowOptions = {
  name: 'Basic user flow to ensure basic functionality',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {flow, collectOptions} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const sidebar = new SidebarUFO(ctx, {
    ANIM_DURATION: ANIM_DURATION_STANDARD,
    categorySelector,
    genreSelector,
    sideMenuBtnSelector
  });
  const movieListPage = new MovieListPageUFO(ctx, {movieImgSelector, subheandlineSelector, heandlineSelector});
  const topRatedName = 'topRated';
  const movieDetailPage = new MovieDetailPageUFO(ctx);

  await flow.navigate(url, {
    stepName: '🧭 Initial navigation',
    config: getLhConfig(
      mergeBudgets([
        angularBudgets,
        generalTimingBudget,
        movieListBudgets,
      ] as unknown as Budget[][])
    ),
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

  return Promise.resolve();
};

export const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
