import fs from 'fs';
import open from 'open';
// @ts-ignore
import puppeteer from 'puppeteer';
// @ts-ignore
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import { Promise } from '@rx-angular/cdk';

export interface PPTOptions {
  headless: boolean
}
export interface FlowOptions {
  name: string
}

export type FlowActions = (flow: any, page?: any) => Promise<void>

export async function captureReport(pptOptions: PPTOptions = { headless: false }, flowOptions: FlowOptions, flowActions: FlowActions) {
  const browser = await puppeteer.launch(pptOptions);
  const page = await browser.newPage();

  const flow = await startFlow(page, { name: flowOptions.name });
  await flowActions(flow, page);

  await browser.close();

  const report = flow.generateReport();
  const fileName = `dist/user-flows/${flowOptions.name}.report.html`;
  fs.writeFileSync(fileName, report);
  open(fileName, { wait: false });
}
