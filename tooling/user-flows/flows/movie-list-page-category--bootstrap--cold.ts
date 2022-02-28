import { captureReport, FlowOptions, PPTOptions } from '../utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Initial Navigation (cold)' };
const testUrl = 'https://angular-movies-a12d3.web.app/';

async function flowActions(flow: any): Promise<void> {
  await flow.navigate(testUrl);
  return Promise.resolve();
}

export const report = async () =>
  await captureReport(pptOptions, flowOptions, flowActions);
