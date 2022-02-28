import { captureReport, FlowActions, FlowOptions, PPTOptions } from '../utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Detail Bootstrap  - Cold' };

function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    async function flowActions(): Promise<void> {
      const testUrl = `${cfg.baseUrl}detail/movie/634649`;
      await flow.navigate(testUrl);
      return Promise.resolve();
    }
  };
}

export const report = async (cfg: { baseUrl: string }) =>
  await captureReport(pptOptions, flowOptions, await setupFlowActions(cfg));
