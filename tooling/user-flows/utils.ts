import * as fs from 'fs';
import * as open from 'open';
// @ts-ignore
import puppeteer from 'puppeteer';
// @ts-ignore
import { startFlow } from 'lighthouse/lighthouse-core/fraggle-rock/api';
import { join } from 'path';

export interface PPTOptions {
  headless: boolean;
}

export interface FlowOptions {
  name: string;
}

export type FlowActions = (flow: any, page?: any) => Promise<void>;

export async function captureReport(
  pptOptions: PPTOptions = { headless: false },
  flowOptions: FlowOptions,
  flowActions: FlowActions
) {
  const browser = await puppeteer.launch(pptOptions);
  const page = await browser.newPage();

  const flow = await startFlow(page, { name: flowOptions.name });
  await flowActions(flow, page);

  await browser.close();

  const report = flow.generateReport();
  const fileName = `measures/user-flows/${flowOptions.name}.report.html`;
  fs.writeFileSync(fileName, report);
  open(fileName, { wait: false });
}

export function resolveAnyFile(path: string): Promise<any> {
  path = join(process.cwd(), path);
  let file;
  if (path.endsWith('.ts')) {
    // Register TS compiler lazily
    // tsNode needs the compilerOptions.module resolution to be 'commonjs',
    // so that imports in the `.uf.ts` files work.
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
      },
    });
  }
  file = require(path);

  // If the user provides a configuration in TS file
  // then there are 2 cases for exporing an object. The first one is:
  // `module.exports = { ... }`. And the second one is:
  // `export default { ... }`. The ESM format is compiled into:
  // `{ default: { ... } }`
  const exports = file.default || file;
  return exports;
}
