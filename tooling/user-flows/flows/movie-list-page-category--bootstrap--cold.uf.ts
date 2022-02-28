import { captureReport, FlowActions, FlowOptions, PPTOptions } from '../utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Category Bootstrap  - Cold' };

function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    const testUrl = `${cfg.baseUrl}list/category/popular`;
    await flow.navigate(testUrl);
    return Promise.resolve();
  };
}

export const report = async (cfg: any) =>
  await captureReport(pptOptions, flowOptions, await setupFlowActions(cfg));
