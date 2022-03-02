import { YargsCommandObject } from '../../cli/model';
import { getCliParam } from '../../cli/utils';
import { readdirSync } from 'fs';
import { join, normalize } from 'path';
import { resolveAnyFile } from '../utils';

export const runCommand: YargsCommandObject = {
  command: 'run',
  description: 'Run a set of user flows and save the result',
  module: {
    handler: async (argv) => {
      if (argv.verbose) {
        console.info(`run "run" as a yargs command`);
      }

      await run();
    },
  },
};

export async function run(): Promise<void> {
  const ufPath: string | false = getCliParam(['ufPath', 'f']);
  if (ufPath == false) {
    throw new Error('--ufPath is required');
  }
  const targetUrl: string | false = getCliParam(['targetUrl', 't']);
  if (targetUrl == false) {
    throw new Error('--targetUrl is required');
  }
  loadUserFlows(ufPath);
  // await Promise.all(userFlows.map((p) => p({ targetUrl }).catch(console.log)));
}

export async function loadUserFlows(path: string): Promise<any> {
  console.log('loadUserFlows');
  const flows = readdirSync(path).map((p) => resolveAnyFile(join(path, p)));
  console.log('flows', flows);
  // require('./rawContent');
}
