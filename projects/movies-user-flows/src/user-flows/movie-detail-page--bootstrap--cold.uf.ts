import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@push-based/user-flow';

const flowOptions: UserFlowOptions = {
  name: 'Movie detail page bootstrap - Cold',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const url = `${collectOptions.url}/detail/movie/634649`;
  await flow.navigate(url, {
    stepName: 'Movie detail page navigation',
  });
  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
