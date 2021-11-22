import { captureReport, FlowOptions, PPTOptions } from './utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Movie-detail cold-warm navigations' };

function setupAction(cfg: { baseUrl: string, id: any }) {
return async (flow: any): Promise<void> => {
  const testUrl = `${cfg.baseUrl}/movie/${cfg.id}`;
  await flow.navigate(testUrl, {
    stepName: 'Cold navigation'
  });
  await flow.navigate(testUrl, {
    stepName: 'Warm navigation',
    configContext: {
      settingsOverrides: {disableStorageReset: true},
    },
  });

  return Promise.resolve();
}
}

export const report = async (cfg: { baseUrl: string, id: any }) => await captureReport(pptOptions, flowOptions, await setupAction(cfg));
