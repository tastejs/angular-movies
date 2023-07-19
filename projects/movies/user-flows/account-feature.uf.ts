import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';

import * as angularBudgets from '../testing/budgets/angular.budgets.json';
import * as generalTimingBudget from '../testing/budgets/general-timing.budgets.json';
import * as movieListBudgets from '../testing/budgets/movie-list.budgets.json';

import {getLhConfig, mergeBudgets,} from '../../movies-user-flows/src/internals/test-sets';
import {ToolBarUfo} from '../../movies-user-flows/src/ufo/desktop/tool-bar.ufo';
import {TmdbUfo} from '../../movies-user-flows/src/ufo/desktop/tmdb.ufo';
import {
  profileMenu,
  profileMenuContent,
  profileMenuLoginItem,
  profileMenuSignoutItem,
  searchSelector,
  searchSubmitKeys
} from '../testing';

const flowOptions: UserFlowOptions = {
  name: 'Login And Logout User Flow',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {page, flow, collectOptions} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const toolbar = new ToolBarUfo(ctx, {
    searchSubmitKeys,
    searchSelector,
    profileMenu,
    profileMenuContent,
    profileMenuLoginItem,
    profileMenuSignoutItem
  });
  const tmdbPage = new TmdbUfo(ctx);

  //This is needed to have it working in headless : true
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  );

  await flow.navigate(url, {
    config: getLhConfig(
      mergeBudgets([
        angularBudgets,
        generalTimingBudget,
        movieListBudgets,
      ] as any)
    ),
    stepName: '🧭 Initial navigation',
  });
  await flow.snapshot({
    stepName: '✔ Initial navigation done',
  });

  await flow.startTimespan({
    stepName: '🧭 Start Login',
  });
  await toolbar.goToTmDbLogin();
  await tmdbPage.login();
  await toolbar.ensureLoginDone();
  await flow.endTimespan();
  await flow.snapshot({
    stepName: '✔ Login Done',
  });

  await flow.startTimespan({
    stepName: '🧭 Start Logout',
  });
  await toolbar.logout();
  await toolbar.ensureLogoutDone();
  await flow.endTimespan();
  await flow.snapshot({
    stepName: '✔ Logout Done',
  });

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
