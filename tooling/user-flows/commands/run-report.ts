import { YargsCommandObject } from '../../cli/model';
import { report as flow1 } from '../flows/movie-detail-page-to-movie-detail-page-navigation--warm.uf';
import { report as flow2 } from '../flows/movie-list-page-category--bootstrap--cold.uf';
import { report as flow3 } from '../flows/movie-list-page-category-to-movie-list-page-category-navigation--cold.uf';
import { report as flow4 } from '../flows/movie-list-page-category-to-movie-list-page-category-navigation--warm.uf';
import { report as flow5 } from '../flows/movie-list-page-category-to-movie-detail-page-navigation--cold.uf';

import { getCliParam } from '../../cli/utils';
import { UserFlowFn } from '../types/model';

const userFlows: UserFlowFn[] = [flow1, flow2, flow3, flow4, flow5];

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
  const baseUrl: string = getCliParam(['targetUrl', 't']);
  if (baseUrl == false) {
    throw new Error('--targetUrl is required');
  }
  await Promise.all(userFlows.map((p) => p({ baseUrl }).catch(console.log)));
}
