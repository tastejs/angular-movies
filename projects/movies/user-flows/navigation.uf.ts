import {
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowOptions,
  UserFlowProvider,
} from '@push-based/user-flow';
import { mergeBudgets } from '../../movies-user-flows/src';
import { getLhConfig } from '../../movies-user-flows/src/internals/test-sets';

import Budget from 'lighthouse/types/lhr/budget';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const angularBudgets: Budget[] = require('../testing/budgets/angular.budgets.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const generalTimingBudget: Budget[] = require('../testing/budgets/general-timing.budgets.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const movieListBudgets: Budget[] = require('../testing/budgets/movie-list.budgets.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const movieDetailBudgets: Budget[] = require('../testing/budgets/movie-detail.budgets.json');

const flowOptions: UserFlowOptions = {
  name: 'Initial Navigation of the Main Pages',
};

const listBudgets = mergeBudgets([
  angularBudgets,
  generalTimingBudget,
  movieListBudgets,
]);
const detailBudgets = mergeBudgets([
  angularBudgets,
  generalTimingBudget,
  movieDetailBudgets,
]);

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const baseUrl = `${collectOptions.url}`;
  const ListNavigations = [
    '/list/category/popular',
    '/list/category/top_rated',
    '/list/category/upcoming',
    '/list/genre/28',
  ].map((url) => ({
    url: baseUrl + url,
    cfg: {
      name: `Navigation ${url}`,
      config: getLhConfig(listBudgets),
    },
  }));
  const detailNavigations = [
    '/detail/movie/594767',
    '/detail/person/1023139',
  ].map((url) => ({
    url: baseUrl + url,
    cfg: {
      name: `Navigation ${url}`,
      config: getLhConfig(detailBudgets),
    },
  }));

  const tests = ListNavigations.concat(detailNavigations);

  for await (const test of tests) {
    test.cfg.name = '🧭 ' + test.cfg.name;
    await flow.navigate(test.url, test.cfg);
  }

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
