import { YargsCommandObject } from '../cli/model';
import { report as coldWarmNavigationMainList, report } from '../flows/cold-warm-navigation--main-list';
import { report as coldWarmNavigationMovieDetail } from '../flows/cold-warm-navigation--movie-detail';
import { report as categoryNavigation } from '../flows/category-to-category-cold-navigation';
import { getCliParam } from '../cli/utils';

export const runCommand: YargsCommandObject = {
  command: 'run',
  description: 'Run a set of user flows and save the result',
  module: {
    handler: async (argv) => {
      if (argv.verbose) console.info(`run "run" as a yargs command`);

      await run();
    }
  }
};


export async function run(): Promise<void> {
   const baseUrl: string = getCliParam(['targetUrl', 't']) || 'https://angular-movies-a12d3.web.app/';

    console.log('baseUrl', baseUrl);
    await coldWarmNavigationMainList({baseUrl});
    await coldWarmNavigationMovieDetail({baseUrl, id: 566525});
    await categoryNavigation({baseUrl});
}

