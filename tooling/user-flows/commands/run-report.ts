import { YargsCommandObject } from '../../cli/model';
import { report as navigation } from '../flows/detail-to-detail-cold-warm-navigation';
import { getCliParam } from '../../cli/utils';

export const runCommand: YargsCommandObject = {
  command: 'run',
  description: 'Run a set of user flows and save the result',
  module: {
    handler: async (argv) => {
      if (argv.verbose) console.info(`run "run" as a yargs command`);

      await run();
    },
  },
};

export async function run(): Promise<void> {
  const baseUrl: string =
    getCliParam(['targetUrl', 't']) || 'https://angular-movies-a12d3.web.app/';

  await navigation({ baseUrl });
  /* await coldWarmNavigationMainList({ baseUrl });
  await coldWarmNavigationMovieDetail({ baseUrl, id: 566525 });
  await categoryNavigation({ baseUrl });*/
}
