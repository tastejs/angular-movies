import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';
import {MovieListPageUFO} from '../../movies-user-flows/src';

const flowOptions: UserFlowOptions = {
  name: 'Ng Universal Pre-rendering',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {flow, collectOptions} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const movieListPage = new MovieListPageUFO(ctx);

  await flow.navigate(url, {
    stepName: '🧭 Initial navigation'
  });
  await movieListPage.awaitHeadingContent();
  return Promise.resolve();
};

export const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
