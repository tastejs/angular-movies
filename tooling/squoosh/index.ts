import { Options } from 'yargs';
import { YargsCommandObject } from '../cli/model';
import { runCommand } from './commands/run-glob-squooshing';
import { runCli } from '../cli';

const OPTIONS: { [key: string]: Options } = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  },
  generator: {
    alias: 'g',
    type: 'string',
    description: 'Name of generator to use for the new image',
  },
  input: {
    alias: 'i',
    type: 'string',
    description: 'Path to image',
  },
  interactive: {
    type: 'boolean',
    description:
      'When false questions are skipped with the values from the suggestions',
    default: true,
  },
};

const COMMANDS: YargsCommandObject[] = [
  // default command
  { ...runCommand, command: '*' },
  runCommand,
];

(async () => {
  runCli({ commands: COMMANDS, options: OPTIONS });
})();
