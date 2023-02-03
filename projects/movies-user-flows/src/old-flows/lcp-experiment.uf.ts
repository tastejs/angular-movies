import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@push-based/user-flow';

const flowOptions: UserFlowOptions = {
  name: 'LCP Audit',
  config: {
    settings: {
      onlyAudits: ['lcp-lazy-loaded'],
    },
  },
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions } = ctx;
  const url = `${collectOptions.url}`;
  await flow.navigate(url, {
    stepName: 'detect LCP',
  });
  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
