import { captureReport, FlowOptions, PPTOptions } from './utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Initial Navigation' };

async function flowActions(flow: any): Promise<void> {
  await flow.navigate('https://angular-movies-a12d3.web.app/');
  return Promise.resolve();
}

export const report = async () => await captureReport(pptOptions, flowOptions, flowActions);
