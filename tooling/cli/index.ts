import * as yargs from 'yargs';
import { Options } from 'yargs';
import { YargsCommandObject } from './model';

export function setupYargs(
  commands: YargsCommandObject[],
  options: { [key: string]: Options }
) {
  commands.forEach((command) => {
    yargs.command(
      command.command,
      command.description,
      () => {},
      command.module.handler
    );
  });
  yargs.options(options).recommendCommands();

  return yargs;
}

export function runCli(cliCfg: {
  commands: YargsCommandObject[];
  options: { [key: string]: Options };
}) {
  setupYargs(cliCfg.commands, cliCfg.options).argv;
}
