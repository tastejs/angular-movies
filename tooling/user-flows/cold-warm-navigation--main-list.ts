import { captureReport, FlowOptions, PPTOptions } from './utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Main movie-list cold-warm navigations' };

function setupFowActions(cfg: any) {
  return async function flowActions(flow: any): Promise<void> {
    const testUrl = `${cfg.baseUrl}list/category/popular`;

    await flow.navigate(testUrl, {
      stepName: 'Cold navigation'
    });
    await flow.navigate(testUrl, {
      stepName: 'Warm navigation',
      configContext: {
        settingsOverrides: { disableStorageReset: true },
      },
    });

    return Promise.resolve();
  }
}

export const report = async (cfg: any) => await captureReport(pptOptions, flowOptions, await setupFowActions(cfg));
