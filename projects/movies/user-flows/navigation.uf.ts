import {
  UserFlowContext,
  UserFlowInteractionsFn,
  UserFlowOptions,
  UserFlowProvider,
} from '@push-based/user-flow';
import { getTestSets } from '../../movies-user-flows/src';

const flowOptions: UserFlowOptions = {
  name: 'Initial Navigation of the Main Pages',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const baseUrl = `${collectOptions.url}`;
  const navigations = getTestSets(
    './projects/movies/testing/budgets/test-set.json',
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
