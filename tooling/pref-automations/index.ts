import { Options } from 'yargs';
import { YargsCommandObject } from '../cli/model';
import { optimizeLcpCommand } from './commands/optimize-lcp';
import { runCli } from '../cli';

const OPTIONS: { [key: string]: Options } = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  },
  withPreloadFallback: {
    alias: 'f',
    type: 'boolean',
    default: true,
    description:
      'If true the script will add a preload tag as fall back for browsers stat do not support fetchpriority',
  },
  target: {
    alias: 't',
    type: 'string',
    description: 'path to HTML file',
  },
  interactive: {
    type: 'boolean',
    description:
      'When false questions are skipped with the values from the suggestions',
    default: true,
  },
};

const COMMANDS: YargsCommandObject[] = [optimizeLcpCommand];

(async () => {
  runCli({ commands: COMMANDS, options: OPTIONS });
})();
