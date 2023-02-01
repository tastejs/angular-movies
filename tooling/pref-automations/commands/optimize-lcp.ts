import { YargsCommandObject } from '../../cli/model';
import { getCliParam } from '../../cli/utils';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { execSync } from 'child_process';

import { optimizeHtmlFileForLCP } from '../utils/log-lcp-from-audit';
import { writeFile } from '@push-based/user-flow/src/lib/internal/utils/file';
import { join } from 'path';

export async function run(): Promise<void> {
  // 1. Execute LCP user flow
  // 2. Find result
  // 3. feed optimize fn
  // 4. check output and log result
  // 4.1 optional check the result again with LH
  const htmlPath: string | false = getCliParam(['target', 't']);
  if (!htmlPath) {
    throw new Error('param --target or -t is required');
  }
  const url: string | false = getCliParam(['url', 'u']);
  if (!url) {
    throw new Error('param --url or -u is required');
  }

  // const targetHtml = readFile<string>(htmlPath, 'string');
  console.log(`Target file to optimize: ${htmlPath}`);
  console.log(`Url to analyze: ${url}`);

  if (!existsSync('./tmp')) {
    mkdirSync('./tmp');
  }
  if (!existsSync('./tmp/user-flows')) {
    mkdirSync('./tmp/user-flows');
  }
  const ufPath = `./tmp/user-flows`;
  writeFile(
    join(ufPath, 'lcp.uf.ts'),
    `
module.exports = {
  flowOptions: {
    name: 'Flow to detect LCP candidate'
  },
  interactions: async (ctx: any) => {
    const { flow, collectOptions } = ctx;
    await flow.navigate(collectOptions.url);
  }
};
  `
  );
  if (!existsSync('./tmp/measures')) {
    mkdirSync('./tmp/measures');
  }
  const outPath = `./tmp/measures`;

  const format = 'json';

  const res = execSync(
    `npx @push-based/user-flow -v --no-open-report --url ${url} --ufPath ${ufPath} --outPath ${outPath} --format ${format}`
  ).toString();
  console.log(`Detection result: ${res}`);
  const preloadFallback: boolean =
    getCliParam<boolean>(['withPreload', 'f']) || false;

  const reportJsonPath = readdirSync(outPath)[0];
  if (!reportJsonPath) {
    throw new Error('Report file not found');
  }

  console.log(`run optimization`);
  optimizeHtmlFileForLCP(htmlPath, join(outPath, reportJsonPath));
}

const command = 'optimize-lcp';
export const optimizeLcpCommand: YargsCommandObject = {
  command,
  description: 'Update related html files with LCP optimizations',
  module: {
    handler: async (argv) => {
      if (argv.verbose) {
        console.info(`run "${command}" as a yargs command`);
      }

      await run();
    },
  },
};
