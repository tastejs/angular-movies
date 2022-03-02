import { Options } from 'yargs';
import { YargsCommandObject } from '../cli/model';
import { runCommand } from './commands/run-report';
import { runCli } from '../cli';

export * from './utils';
export * from './types/model';

const OPTIONS: Record<string, Options> = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  },
  path: {
    alias: 'p',
    type: 'string',
    description: 'Path to web-perf.config.json',
  },
  targetUrl: {
    alias: 't',
    type: 'string',
    description: 'URL to analyze',
  },
  ufPath: {
    alias: 'f',
    type: 'string',
    description: 'folder containing user-flow files `*.uf.ts` or `*.uf.js`',
  },
  interactive: {
    type: 'boolean',
    description:
      'When false questions are skipped with the values from the suggestions',
    default: true,
  },
};

const COMMANDS: YargsCommandObject[] = [runCommand];

(async () => {
  runCli({ commands: COMMANDS, options: OPTIONS });
})();
