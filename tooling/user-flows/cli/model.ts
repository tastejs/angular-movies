import { CommandModule } from 'yargs';

export interface YargsCommandObject {
  command: string | ReadonlyArray<string>;
  description: string;
  module: CommandModule;
}
