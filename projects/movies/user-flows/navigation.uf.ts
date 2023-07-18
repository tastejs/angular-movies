import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';
import {mergeBudgets} from '../../movies-user-flows/src';
import {getLhConfig} from '../../movies-user-flows/src/internals/test-sets';
import * as angularBudgets from '../testing/budgets/angular.budgets.json';
import * as generalTimingBudget from '../testing/budgets/general-timing.budgets.json';
import * as movieListBudgets from '../testing/budgets/movie-list.budgets.json';
import * as movieDetailBudgets from '../testing/budgets/movie-detail.budgets.json';

const flowOptions: UserFlowOptions = {
  name: 'Initial Navigation of the Main Pages',
};

const listBudgets = mergeBudgets([
  angularBudgets,
  generalTimingBudget,
  movieListBudgets,
] as any);
const detailBudgets = mergeBudgets([
  angularBudgets,
  generalTimingBudget,
  movieDetailBudgets,
] as any);

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {flow, collectOptions} = ctx;
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
