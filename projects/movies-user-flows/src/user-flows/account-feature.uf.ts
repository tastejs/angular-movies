import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';

import {mergeBudgets} from '../internals/test-sets';
import {ToolBarUfo} from "../ufo/desktop/tool-bar.ufo";

const flowOptions: UserFlowOptions = {
  name: 'Basic user flow to ensure basic functionality',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {page, flow, collectOptions} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const toolbar = new ToolBarUfo(ctx);

  await flow.navigate(url, {
    stepName: '🧭 Initial navigation',
    config: {
      extends: 'lighthouse:default',
      settings: {
        budgets: mergeBudgets([
          "./projects/movies-user-flows/src/configs/angular.budgets.json",
          "./projects/movies-user-flows/src/configs/general-timing.budgets.json",
          "./projects/movies-user-flows/src/configs/movie-list.budgets.json"
        ]),
      },
    },
  });

  await flow.startTimespan({
    stepName: '🔑 Log in',
  });
  await toolbar.openProfileMenu();
  await toolbar.login();

  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
