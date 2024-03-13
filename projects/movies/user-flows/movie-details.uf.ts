import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';

import {mergeBudgets, MovieDetailPageUFO, MovieListPageUFO,} from '../../movies-user-flows/src';
import {getLhConfig} from "../../movies-user-flows/src/internals/test-sets";
import * as angularBudgets from "../testing/budgets/angular.budgets.json";
import * as generalTimingBudget from "../testing/budgets/general-timing.budgets.json";
import * as movieListBudgets from "../testing/budgets/movie-list.budgets.json";

const flowOptions: UserFlowOptions = {
  name: 'Movie Detail Tests',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {flow, collectOptions} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const movieListPage = new MovieListPageUFO(ctx);
  const movieDetailPage = new MovieDetailPageUFO(ctx);

  await flow.navigate(url, {
    stepName: '🧭 Initial navigation',
    config: getLhConfig(
      mergeBudgets([angularBudgets, generalTimingBudget, movieListBudgets])
    )
  });
  await flow.snapshot({
    stepName: '✔ Initial navigation done',
  });


  let currentHeroImageSrc = undefined;

  // ======= Detail navigations =======
  await flow.startTimespan({
    stepName: '🧭 Navigate to detail page',
  });
  await movieListPage.navigateToDetail(1);
  await movieDetailPage.awaitAllContent();
  currentHeroImageSrc = await movieDetailPage.getHeroImageSrc();
  await flow.endTimespan();
  await flow.snapshot({
    stepName: '✔ Navigation to detail page done',
  });

  // ======= Hero image change for recommendations =======

  await flow.startTimespan({
    stepName: '🧭 Navigate to other detail page',
  });
  await movieListPage.navigateToDetail(1);
  await movieDetailPage.awaitAllContent();

  const recommendationImageSrc = await movieDetailPage.getHeroImageSrc();
  if (recommendationImageSrc === currentHeroImageSrc) {
    throw new Error("hero image does not change when navigating to recommended movie!")
  }
  await flow.endTimespan();
  await flow.snapshot({
    stepName: '✔ Navigation to other detail page done',
  });

  return Promise.resolve();
};

export const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;