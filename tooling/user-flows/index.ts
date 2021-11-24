import {report as coldWarmNavigationMainList} from "./cold-warm-navigation--main-list";
import {report as coldWarmNavigationMovieDetail} from "./cold-warm-navigation--movie-detail";
import {report as categoryNavigation} from "./category-to-category-cold-navigation";

// const baseUrl = 'http://localhost:4200/';
const baseUrl = 'https://angular-movies-a12d3.web.app/';

import { Options } from 'yargs';
import { YargsCommandObject } from './cli/model';
import { runCommand } from './commands/run-report';
import { runCli } from './cli';

const OPTIONS: { [key: string]: Options } = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  },
  path: {
    alias: 'p',
    type: 'string',
    description: 'Path to web-perf.config.json'
  },
  targetUrl: {
    alias: 't',
    type: 'string',
    description: 'URL to analyze'
  },
  interactive: {
    type: 'boolean',
    description:
      'When false questions are skipped with the values from the suggestions',
    default: true
  }
};

const COMMANDS: YargsCommandObject[] = [
  runCommand
];

(async () => {
  runCli({ commands: COMMANDS, options: OPTIONS });
})()


