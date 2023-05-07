import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';

import {mergeBudgets} from '../internals/test-sets';
import {ToolBarUfo} from "../ufo/desktop/tool-bar.ufo";
import {TmdbUfo} from "../ufo/desktop/tmdb.ufo";

const flowOptions: UserFlowOptions = {
  name: 'Basic user flow to ensure basic functionality',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {browser, page, flow, collectOptions} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const toolbar = new ToolBarUfo(ctx);
  const tmdbPage = new TmdbUfo(ctx);

  //This is needed to have it working in headless : true
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36')

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
    }
  });

  await toolbar.goToTmDbLogin();

  await tmdbPage.login();

  await toolbar.ensureLoginDone();


  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions
};

module.exports = userFlowProvider;
