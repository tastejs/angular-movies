import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@push-based/user-flow';
import { readBudgets } from '@push-based/user-flow/src/lib/commands/assert/utils/budgets';

import { MovieDetailPageUFO } from '../ufo/desktop/movie-detail-page.ufo';
import { MovieListPageUFO } from '../ufo/desktop/movie-list-page.ufo';
import { SidebarUFO } from '../ufo/mobile/side-bar.ufo';
import { readFileSync } from 'fs';
import Budget from 'lighthouse/types/lhr/budget';
import { getTestSets } from '../internals/test-sets';

const flowOptions: UserFlowOptions = {
  name: 'Initial Navigation of the Main Pages',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { page, flow, collectOptions } = ctx;
  const baseUrl = `${collectOptions.url}`;
  const navigations = getTestSets(
    'projects/movies-user-flows/src/configs/test-set.json',
    {
      baseUrl,
      match: 'navigation',
    }
  );
  for await (const test of navigations) {
    test.cfg.config.name = '🧭 ' + test.cfg.config.name;
    await flow.navigate(test.url, test.cfg);
  }

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
