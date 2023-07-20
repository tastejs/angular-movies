import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';

import {mergeBudgets, MovieDetailPageUFO, MovieListPageUFO, SidebarUFO,} from '../../../movies-user-flows/src';
import {getLhConfig} from '../../../movies-user-flows/src/internals/test-sets';
import * as angularBudgets from '../../src/budgets/angular.budgets.json';
import * as generalTimingBudget from '../../src/budgets/general-timing.budgets.json';
import Budget from 'lighthouse/types/lhr/budget';
import {CategoryNames, sideMenuBtnSelector} from "../../src/fixtures";
import {GenreIds} from "../../../movies/testing";

const flowOptions: UserFlowOptions = {
  name: 'Basic user flow to ensure basic functionality',
};

export function setupCiFlow(userFlowObjects: (ctx: UserFlowContext) => {
  movieDetailPage: MovieDetailPageUFO,
  movieListPage: MovieListPageUFO
}, fixtures: {
  topRatedName: CategoryNames,
  categorySelector: (c: CategoryNames) => string;
  movieImgSelector: (idx: number) => string;
  ANIM_DURATION: number;
  genreSelector: (g: GenreIds) => string;
  heandlineSelector: string;
  subheandlineSelector: string;
  sideMenuBtnSelector: string
}): UserFlowProvider {


  const interactions: UserFlowInteractionsFn = async (
    ctx: UserFlowContext
  ): Promise<any> => {
    const {flow, collectOptions} = ctx;
    const url = `${collectOptions.url}/list/category/popular`;
    const sidebar = new SidebarUFO(ctx, {
      ANIM_DURATION: fixtures.ANIM_DURATION,
      categorySelector: fixtures.categorySelector,
      genreSelector: fixtures.genreSelector,
      sideMenuBtnSelector: sideMenuBtnSelector
    });

    const {movieListPage, movieDetailPage} = userFlowObjects(ctx);


    await flow.navigate(url, {
      stepName: '🧭 Initial navigation',
      config: getLhConfig(
        mergeBudgets([
          angularBudgets,
          generalTimingBudget
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
    await sidebar.navigateToCategory(fixtures.topRatedName);
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

  return {
    flowOptions,
    interactions,
  };
}
