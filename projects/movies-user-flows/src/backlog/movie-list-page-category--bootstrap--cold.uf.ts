import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@user-flow/cli';

const flowOptions: UserFlowOptions = { name: 'Detail Bootstrap  - Cold' };

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, baseUrl } = ctx;
  const testUrl = `${baseUrl}list/category/popular`;
  await flow.navigate(testUrl);
  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
