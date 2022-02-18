import { Options } from 'yargs';
import { YargsCommandObject } from '../cli/model';
import { updateDocsCommand } from './commands/update-docs';
import { runCli } from '../cli';

const OPTIONS: { [key: string]: Options } = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  },
  stats: {
    alias: 's',
    type: 'string',
    description: 'Path to stats.json',
  },
  target: {
    alias: 't',
    type: 'string',
    description: 'path to markdown file',
  },
  interactive: {
    type: 'boolean',
    description:
      'When false questions are skipped with the values from the suggestions',
    default: true,
  },
};

const COMMANDS: YargsCommandObject[] = [updateDocsCommand];

(async () => {
  runCli({ commands: COMMANDS, options: OPTIONS });
})();
